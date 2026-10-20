package com.example.genesis.dto.response;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Represents the currency exchange-rate response returned to the frontend.
 *
 * <p>The response contains the base currency, the supported conversion rates,
 * and the timestamp indicating when the exchange-rate data was last updated
 * by the external provider.</p>
 */
public final class CurrencyRatesResponse {

    private final String baseCurrency;
    private final Map<String, BigDecimal> rates;
    private final String updatedAt;

    /**
     * Creates a currency exchange-rate response.
     *
     * @param baseCurrency base currency used for the exchange rates
     * @param rates map of supported currency codes to conversion rates
     * @param updatedAt timestamp indicating when the rates were last updated
     */
    public CurrencyRatesResponse(
            final String baseCurrency,
            final Map<String, BigDecimal> rates,
            final String updatedAt) {

        this.baseCurrency = baseCurrency;
        this.rates = rates;
        this.updatedAt = updatedAt;
    }

    /**
     * Returns the base currency used for the exchange rates.
     *
     * @return base currency code, for example {@code CAD}
     */
    public String getBaseCurrency() {
        return baseCurrency;
    }

    /**
     * Returns the supported exchange rates.
     *
     * @return map of currency codes to conversion rates
     */
    public Map<String, BigDecimal> getRates() {
        return rates;
    }

    /**
     * Returns the timestamp of the most recent exchange-rate update.
     *
     * @return last update timestamp
     */
    public String getUpdatedAt() {
        return updatedAt;
    }
}