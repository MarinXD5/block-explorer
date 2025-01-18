package com.seminar.kriptovalute.models;

import wf.bitcoin.javabitcoindrpcclient.BitcoindRpcClient;

import java.math.BigDecimal;
import java.util.List;

public class RawTransactionWithInputs {
    private BitcoindRpcClient.RawTransaction rawTransaction;
    private List<InputWithAmount> vinWithAmounts;

    public BitcoindRpcClient.RawTransaction getRawTransaction() {
        return rawTransaction;
    }

    public void setRawTransaction(BitcoindRpcClient.RawTransaction rawTransaction) {
        this.rawTransaction = rawTransaction;
    }

    public List<InputWithAmount> getVinWithAmounts() {
        return vinWithAmounts;
    }

    public void setVinWithAmounts(List<InputWithAmount> vinWithAmounts) {
        this.vinWithAmounts = vinWithAmounts;
    }

    public static class InputWithAmount {
        private String txid;
        private int vout;
        private BigDecimal amount;

        public String getTxid() {
            return txid;
        }

        public void setTxid(String txid) {
            this.txid = txid;
        }

        public int getVout() {
            return vout;
        }

        public void setVout(int vout) {
            this.vout = vout;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}