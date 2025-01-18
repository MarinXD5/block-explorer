package com.seminar.kriptovalute.Controller;

import com.seminar.kriptovalute.Service.ClientService;
import com.seminar.kriptovalute.models.RawTransactionWithInputs;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getBlockchainInfo(@RequestParam String blockchain) {
        Map<String, Object> response = new HashMap<>();

        double bitcoinValue = clientService.fetchBitcoinValue();
        double litecoinValue = clientService.fetchLitecoinValue();
        List<Map<String, Object>> latestBlocks = clientService.getLatestBlocks(clientService.getClient(blockchain), 5);
        List<Map<String, Object>>blocksMined24h = clientService.calculateBlocksMined24h(clientService.getClient(blockchain));

        response.put("bitcoinValue", bitcoinValue);
        response.put("litecoinValue", litecoinValue);
        response.put("latestBlocks", latestBlocks);
        response.put("blocksMined24h", blocksMined24h);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public Object searchBlockchain(
            @RequestParam String blockchain,
            @RequestParam String query
    ) throws Exception {
        return clientService.searchBlockchain(blockchain, query);
    }

    @GetMapping("/transaction")
    public Map<BigDecimal, RawTransactionWithInputs> getTransactionDetails(
            @RequestParam String blockchain,
            @RequestParam String txId
    ) throws Exception {
        return clientService.getTransactionDetails(blockchain, txId);
    }
}
