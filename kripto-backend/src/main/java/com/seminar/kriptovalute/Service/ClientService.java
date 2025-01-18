package com.seminar.kriptovalute.Service;

import com.seminar.kriptovalute.models.RawTransactionWithInputs;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import wf.bitcoin.javabitcoindrpcclient.BitcoinJSONRPCClient;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClientService {

    private final BitcoinJSONRPCClient bitcoinMainnetClient;
    private final BitcoinJSONRPCClient bitcoinTestnetClient;
    private final BitcoinJSONRPCClient litecoinClient;

    public ClientService() throws Exception {
        bitcoinMainnetClient = new BitcoinJSONRPCClient("http://student:n24PaIR7EwPyeMi1GB6cx4bVt1R24fZ8xl2jd8kr2REi2i8Tn@blockchain.oss.unist.hr:50004");
        bitcoinTestnetClient = new BitcoinJSONRPCClient("http://student:n24PaIR7EwPyeMi1GB6cx4bVt1R24fZ8xl2jd8kr2REi2i8Tn@blockchain.oss.unist.hr:51002");
        litecoinClient = new BitcoinJSONRPCClient("http://student:n24PaIR7EwPyeMi1GB6cx4bVt1R24fZ8xl2jd8kr2REi2i8Tn@blockchain.oss.unist.hr:53012");
    }

    public BitcoindRpcClient.BlockChainInfo getBlockchainInfo(String blockchain) throws Exception {
        return getClient(blockchain).getBlockChainInfo();
    }

    public Object searchBlockchain(String blockchain, String query) throws Exception {
        BitcoindRpcClient client = getClient(blockchain);

        try {
            return client.getRawTransaction(query);
        } catch (Exception e) {
            try {
                return client.getBlock(query);
            } catch (Exception ex) {
                try {
                    int height = Integer.parseInt(query);
                    return client.getBlock(client.getBlockHash(height));
                } catch (NumberFormatException nfe) {
                    throw new IllegalArgumentException("Invalid search query");
                }
            }
        }
    }

    public BitcoindRpcClient getClient(String blockchain) throws IllegalArgumentException {
        return switch (blockchain) {
            case "bitcoin_mainnet" -> bitcoinMainnetClient;
            case "bitcoin_testnet" -> bitcoinTestnetClient;
            case "litecoin_mainnet" -> litecoinClient;
            default -> throw new IllegalArgumentException("Unknown blockchain: " + blockchain);
        };
    }

    public double fetchBitcoinValue() {
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
        Map<String, Map<String, Object>> response = restTemplate.getForObject(apiUrl, Map.class);
        Object value = response.get("bitcoin").get("usd");
        return value instanceof Integer ? ((Integer) value).doubleValue() : (Double) value;
    }

    public double fetchLitecoinValue() {
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd";
        Map<String, Map<String, Object>> response = restTemplate.getForObject(apiUrl, Map.class);
        Object value = response.get("litecoin").get("usd");
        return value instanceof Integer ? ((Integer) value).doubleValue() : (Double) value;
    }

    public List<Map<String, Object>> getLatestBlocks(BitcoindRpcClient client, int count) {
        List<Map<String, Object>> latestBlocks = new ArrayList<>();
        String currentBlockHash = client.getBestBlockHash();

        for (int i = 0; i < count; i++) {
            BitcoindRpcClient.Block blockInfo = client.getBlock(currentBlockHash);
            latestBlocks.add(Map.of(
                    "height", blockInfo.height(),
                    "hash", blockInfo.hash(),
                    "time", blockInfo.time()
            ));
            currentBlockHash = blockInfo.previousHash();
            if (currentBlockHash == null) break;
        }

        return latestBlocks;
    }

    public List<Map<String, Object>> calculateBlocksMined24h(BitcoindRpcClient client) {
        List<Map<String, Object>> blocksMined24h = new ArrayList<>();
        String currentBlockHash = client.getBestBlockHash();

        LocalDateTime todayStart = LocalDateTime.now(ZoneOffset.UTC).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime todayEnd = LocalDateTime.now(ZoneOffset.UTC).withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        long startOfDayEpoch = todayStart.toEpochSecond(ZoneOffset.UTC);
        long endOfDayEpoch = todayEnd.toEpochSecond(ZoneOffset.UTC);

        while (currentBlockHash != null) {
            BitcoindRpcClient.Block block = client.getBlock(currentBlockHash);

            long blockTimeEpoch = block.time().toInstant().getEpochSecond();

            if (blockTimeEpoch >= startOfDayEpoch && blockTimeEpoch <= endOfDayEpoch) {
                blocksMined24h.add(Map.of(
                        "height", block.height(),
                        "hash", block.hash(),
                        "numOfTransactions", block.tx().size(),
                        "time", block.time()
                ));
            } else if (blockTimeEpoch < startOfDayEpoch) {
                break;
            }

            currentBlockHash = block.previousHash();
        }

        return blocksMined24h;
    }

    public Map<BigDecimal, RawTransactionWithInputs> getTransactionDetails(String blockchain, String txId){
        BitcoindRpcClient client = getClient(blockchain);
        Map<BigDecimal, RawTransactionWithInputs> transactionDetails = new HashMap<>();
        BitcoindRpcClient.RawTransaction transaction = client.getRawTransaction(txId);

        RawTransactionWithInputs transactionWithInputs = new RawTransactionWithInputs();
        transactionWithInputs.setRawTransaction(transaction);

        List<RawTransactionWithInputs.InputWithAmount> vinWithAmounts = new ArrayList<>();
        for (BitcoindRpcClient.RawTransaction.In input : transaction.vIn()) {
            RawTransactionWithInputs.InputWithAmount inputWithAmount = new RawTransactionWithInputs.InputWithAmount();
            inputWithAmount.setTxid(input.txid());
            inputWithAmount.setVout(input.vout());

            BitcoindRpcClient.RawTransaction referencedTransaction = client.getRawTransaction(input.txid());
            BitcoindRpcClient.RawTransaction.Out referencedOutput = referencedTransaction.vOut().get(input.vout());

            inputWithAmount.setAmount(referencedOutput.value());
            vinWithAmounts.add(inputWithAmount);
        }
        transactionWithInputs.setVinWithAmounts(vinWithAmounts);
        transactionDetails.put(calculateTransactionFee(transaction), transactionWithInputs);
        return transactionDetails;
    }

    public BigDecimal calculateTransactionFee(@RequestBody BitcoindRpcClient.RawTransaction transaction){
        BigDecimal inputs = BigDecimal.valueOf(0);
        BigDecimal outputs = BigDecimal.valueOf(0);
        for (BitcoindRpcClient.RawTransaction.Out output : transaction.vOut()){
            outputs = outputs.add(output.value());
        }
        for (BitcoindRpcClient.RawTransaction.In input : transaction.vIn()){
            if (input.txid() == null || input.txid().isEmpty()) {
                continue;
            }
            inputs = inputs.add(input.getTransactionOutput().value());
        }
        if (inputs.subtract(outputs).compareTo(BigDecimal.ZERO) < 0){
            return BigDecimal.ZERO;
        }
        return inputs.subtract(outputs);
    }
}