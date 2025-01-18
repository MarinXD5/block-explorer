package com.seminar.kriptovalute.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import wf.bitcoin.javabitcoindrpcclient.BitcoinJSONRPCClient;
import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.net.MalformedURLException;
import java.util.Map;

@Configuration
public class ClientConfig {

    @Bean
    public Map<String, BitcoindRpcClient> bitcoinClients(
            @Value("${bitcoin.mainnet.rpc.host}") String mainnetHost,
            @Value("${bitcoin.mainnet.rpc.port}") int mainnetPort,
            @Value("${bitcoin.mainnet.rpc.user}") String mainnetUser,
            @Value("${bitcoin.mainnet.rpc.password}") String mainnetPassword,

            @Value("${bitcoin.testnet.rpc.host}") String testnetHost,
            @Value("${bitcoin.testnet.rpc.port}") int testnetPort,
            @Value("${bitcoin.testnet.rpc.user}") String testnetUser,
            @Value("${bitcoin.testnet.rpc.password}") String testnetPassword,

            @Value("${litecoin.mainnet.rpc.host}") String litecoinHost,
            @Value("${litecoin.mainnet.rpc.port}") int litecoinPort,
            @Value("${litecoin.mainnet.rpc.user}") String litecoinUser,
            @Value("${litecoin.mainnet.rpc.password}") String litecoinPassword
    ) throws MalformedURLException {
        return Map.of(
                "bitcoin_mainnet", new BitcoinJSONRPCClient(String.format("http://%s:%s@%s:%s", mainnetUser, mainnetPassword, mainnetHost, mainnetPort)),
                "bitcoin_testnet", new BitcoinJSONRPCClient(String.format("http://%s:%s@%s:%s", testnetUser, testnetPassword, testnetHost, testnetPort)),
                "litecoin_mainnet", new BitcoinJSONRPCClient(String.format("http://%s:%s@%s:%s", litecoinUser, litecoinPassword, litecoinHost, litecoinPort))
        );
    }

        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**").allowedOrigins("http://localhost:4200");
                }
            };
        }
}
