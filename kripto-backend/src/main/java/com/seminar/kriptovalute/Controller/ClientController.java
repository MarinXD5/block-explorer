package com.seminar.kriptovalute.Controller;

import com.seminar.kriptovalute.Service.ClientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

@RestController
@RequestMapping("/api/blockchain")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/info")
    public BitcoindRpcClient.BlockChainInfo getBlockchainInfo(@RequestParam String blockchain) throws Exception {
        return clientService.getBlockchainInfo(blockchain);
    }

    @GetMapping("/search")
    public Object searchBlockchain(
            @RequestParam String blockchain,
            @RequestParam String query
    ) throws Exception {
        return clientService.searchBlockchain(blockchain, query);
    }
}
