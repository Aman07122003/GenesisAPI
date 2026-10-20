package com.example.genesis.service;

import com.example.genesis.client.CurrencyApiClient;
import com.example.genesis.dto.response.CurrencyRatesResponse;
import com.example.genesis.dto.response.ExchangeRateApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Service responsible for retrieving and preparing currency exchange rates.
 *
 * <p>The service obtains the latest exchange-rate data from the external
 * currency provider through {@link CurrencyApiClient}. It validates the
 * provider response and returns only the currencies supported by the
 * frontend application.</p>
 *
 * <p>The shipping API currently returns shipment charges in Canadian
 * Dollars (CAD), therefore CAD is used as the supported base currency.</p>
 */
@Service
public final class CurrencyService {

    /**
     * Currencies supported by the frontend currency selector.
     */
    private static final Set<String> SUPPORTED_CURRENCIES =
            Set.of(
                    "CAD",
                    "USD",
                    "EUR",
                    "INR",
                    "JPY"
            );

    /**
     * Client responsible for communicating with the external
     * exchange-rate provider.
     */
    private final CurrencyApiClient client;

    /**
     * Creates the currency service with the required API client.
     *
     * @param client client responsible for retrieving exchange-rate data
     *               from the external currency provider
     */
    public CurrencyService(
            final CurrencyApiClient client) {

        this.client = client;
    }

    /**
     * Retrieves exchange rates for the requested base currency.
     *
     * <p>The supplied currency code is normalized before processing.
     * Currently, only CAD is accepted because shipment prices returned
     * by the shipping API are denominated in Canadian Dollars.</p>
     *
     * <p>The method retrieves the latest exchange rates from the external
     * provider, validates the response, filters the result to the currencies
     * supported by the frontend, and returns a simplified response object.</p>
     *
     * @param requestedBaseCurrency base currency requested by the frontend,
     *                              for example {@code CAD}
     * @return exchange-rate response containing the supported currencies
     *         and the provider's last update time
     * @throws ResponseStatusException if the requested base currency is not
     *                                 supported or the external provider
     *                                 returns an invalid response
     */
    public CurrencyRatesResponse getRates(
            final String requestedBaseCurrency) {

        /*
         * Normalize the requested currency code so values such as
         * "cad", "Cad", or " CAD " are treated consistently.
         */
        final String baseCurrency =
                requestedBaseCurrency
                        .trim()
                        .toUpperCase(Locale.ROOT);

        /*
         * Shipment prices are currently returned by the shipping API
         * in CAD, so CAD is the only supported base currency.
         */
        if (!"CAD".equals(baseCurrency)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only CAD is currently supported as the base currency."
            );
        }

        /*
         * Retrieve the latest exchange rates from the external
         * currency provider.
         */
        final ExchangeRateApiResponse apiResponse =
                client.getLatestRates(baseCurrency);

        /*
         * Validate that the provider returned a response.
         */
        if (apiResponse == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Currency provider returned an empty response."
            );
        }

        /*
         * Validate that the external provider processed the request
         * successfully.
         */
        if (!"success".equalsIgnoreCase(
                apiResponse.getResult())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Currency provider error: "
                            + apiResponse.getErrorType()
            );
        }

        /*
         * Ensure that the provider response contains exchange-rate data.
         */
        if (apiResponse.getConversionRates() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Currency provider did not return exchange rates."
            );
        }

        /*
         * Build the response returned to the frontend.
         *
         * LinkedHashMap is used so the currencies retain insertion order
         * in the generated JSON response.
         */
        final Map<String, BigDecimal> rates =
                new LinkedHashMap<>();

        /*
         * The conversion rate from CAD to CAD is always 1.
         */
        rates.put(
                "CAD",
                BigDecimal.ONE
        );

        /*
         * Copy only the currencies required by the frontend instead
         * of returning every currency supplied by the external API.
         */
        for (final String currency : SUPPORTED_CURRENCIES) {

            /*
             * CAD has already been added manually with a value of 1.
             */
            if ("CAD".equals(currency)) {
                continue;
            }

            final BigDecimal rate =
                    apiResponse
                            .getConversionRates()
                            .get(currency);

            /*
             * Treat a missing supported currency as an invalid response
             * from the external provider.
             */
            if (rate == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Currency provider did not return rate for "
                                + currency
                );
            }

            rates.put(
                    currency,
                    rate
            );
        }

        /*
         * Return the simplified response expected by the Angular frontend.
         */
        return new CurrencyRatesResponse(
                baseCurrency,
                rates,
                apiResponse.getTimeLastUpdateUtc()
        );
    }
}