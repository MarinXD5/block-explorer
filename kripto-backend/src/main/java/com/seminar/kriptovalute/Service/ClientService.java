package com.seminar.kriptovalute.Service;

import org.springframework.stereotype.Service;
import wf.bitcoin.javabitcoindrpcclient.BitcoinJSONRPCClient;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.util.Map;
import java.util.Optional;

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

    public BitcoindRpcClient.BlockChainInfo getBlockchainInfo(String blockchain) {
        return getClient(blockchain).getBlockChainInfo();
    }

    public Object searchBlockchain(String blockchain, String query) {
        BitcoinJSONRPCClient client = getClient(blockchain);

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

    private BitcoinJSONRPCClient getClient(String blockchain) throws IllegalArgumentException {
        return switch (blockchain) {
            case "bitcoin_mainnet" -> bitcoinMainnetClient;
            case "bitcoin_testnet" -> bitcoinTestnetClient;
            case "litecoin_mainnet" -> litecoinClient;
            default -> throw new IllegalArgumentException("Unknown blockchain: " + blockchain);
        };
    }

    public BitcoindRpcClient.RawTransaction getTransactionDetails(String blockchain, String txId) {
        BitcoinJSONRPCClient client = getClient(blockchain);
        return client.getRawTransaction(txId);
    }
}
