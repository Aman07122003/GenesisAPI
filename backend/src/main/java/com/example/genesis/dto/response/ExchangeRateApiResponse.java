package com.example.genesis.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Represents the response returned by the external exchange-rate provider.
 *
 * <p>This DTO maps the JSON fields returned by the third-party currency API
 * into Java-friendly property names. Unknown fields are ignored so that
 * additional fields added by the provider do not break deserialization.</p>
 *
 * <p>The response contains the request result, base currency, last update
 * time, conversion rates, and an optional error type when the request fails.</p>
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public final class ExchangeRateApiResponse {

    @JsonProperty("base_code")
    private String baseCode;

    @JsonProperty("conversion_rates")
    private Map<String, BigDecimal> conversionRates;

    @JsonProperty("error-type")
    private String errorType;

    private String result;

    @JsonProperty("time_last_update_utc")
    private String timeLastUpdateUtc;

    /**
     * Creates an empty response object.
     *
     * <p>This constructor is required by Jackson during JSON
     * deserialization.</p>
     */
    public ExchangeRateApiResponse() {
    }

    /**
     * Returns the base currency code used for the exchange-rate response.
     *
     * @return base currency code, for example {@code CAD}
     */
    public String getBaseCode() {
        return baseCode;
    }

    /**
     * Returns the exchange rates relative to the base currency.
     *
     * @return map of currency codes to conversion rates
     */
    public Map<String, BigDecimal> getConversionRates() {
        return conversionRates;
    }

    /**
     * Returns the provider-specific error type when the request fails.
     *
     * @return error type, or {@code null} when no error is present
     */
    public String getErrorType() {
        return errorType;
    }

    /**
     * Returns the result status of the external API request.
     *
     * @return result status, such as {@code success} or {@code error}
     */
    public String getResult() {
        return result;
    }

    /**
     * Returns the timestamp of the provider's most recent rate update.
     *
     * @return last update timestamp in UTC
     */
    public String getTimeLastUpdateUtc() {
        return timeLastUpdateUtc;
    }

    /**
     * Sets the base currency code.
     *
     * @param baseCode base currency code returned by the provider
     */
    public void setBaseCode(final String baseCode) {
        this.baseCode = baseCode;
    }

    /**
     * Sets the exchange rates returned by the external provider.
     *
     * @param conversionRates map of currency codes to conversion rates
     */
    public void setConversionRates(
            final Map<String, BigDecimal> conversionRates) {

        this.conversionRates = conversionRates;
    }

    /**
     * Sets the provider-specific error type.
     *
     * @param errorType error identifier returned by the provider
     */
    public void setErrorType(final String errorType) {
        this.errorType = errorType;
    }

    /**
     * Sets the result status of the external API request.
     *
     * @param result result status returned by the provider
     */
    public void setResult(final String result) {
        this.result = result;
    }

    /**
     * Sets the timestamp of the provider's most recent rate update.
     *
     * @param timeLastUpdateUtc last update timestamp in UTC
     */
    public void setTimeLastUpdateUtc(
            final String timeLastUpdateUtc) {

        this.timeLastUpdateUtc = timeLastUpdateUtc;
    }
}