package com.example.genesis.client;

import com.example.genesis.dto.response.ExchangeRateApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Client responsible for communicating with the external exchange-rate API.
 *
 * <p>This client builds the provider request URL using the configured base URL
 * and API key, sends the HTTP request, and maps the response to
 * {@link ExchangeRateApiResponse}.</p>
 */
@Component
public final class CurrencyApiClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;

    /**
     * Creates the currency API client using the configured provider details.
     *
     * @param baseUrl base URL of the external exchange-rate API
     * @param apiKey API key used to authenticate requests to the provider
     */
    public CurrencyApiClient(
            @Value("${currency.api.base-url}") final String baseUrl,
            @Value("${currency.api.key}") final String apiKey) {

        this.restTemplate = new RestTemplate();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    /**
     * Retrieves the latest exchange rates for the supplied base currency.
     *
     * <p>The response returned by the external provider is mapped to
     * {@link ExchangeRateApiResponse} for further processing by the
     * service layer.</p>
     *
     * @param baseCurrency base currency used to retrieve exchange rates,
     *                     for example {@code CAD}
     * @return response returned by the external exchange-rate provider
     */
    public ExchangeRateApiResponse getLatestRates(
            final String baseCurrency) {

        final String url =
                baseUrl
                        + "/"
                        + apiKey
                        + "/latest/"
                        + baseCurrency;

        return restTemplate.getForObject(
                url,
                ExchangeRateApiResponse.class
        );
    }
}