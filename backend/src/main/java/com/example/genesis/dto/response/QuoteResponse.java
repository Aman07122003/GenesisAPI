package com.example.genesis.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Represents the quotation response returned by the Genesis quotation API.
 *
 * <p>The response contains the shipping rates available for the requested
 * shipment. Each rate provides pricing and service information such as the
 * shipping charge, service code, service name, shipping mode, estimated
 * transit time, weight, volume, and applicable currency.</p>
 *
 * <p>The rates are represented as a list of {@link QuoteItemResponse}
 * objects. The list is defensively copied when the response is created
 * and when it is returned by the getter to prevent external modification
 * of the response data.</p>
 */
public final class QuoteResponse {

    private final List<QuoteItemResponse> rates;

    /**
     * Creates a quotation response containing the available shipping rates.
     *
     * <p>If the Genesis API returns no rates, a null value is converted to
     * an empty list so that callers can safely iterate over the response
     * without performing a null check.</p>
     *
     * @param rates shipping rates returned by the Genesis quotation API
     */
    @JsonCreator
    public QuoteResponse(
            @JsonProperty("rates") final List<QuoteItemResponse> rates) {

        this.rates = rates == null ? List.of() : List.copyOf(rates);
    }

    /**
     * Returns the shipping rates available for the requested shipment.
     *
     * <p>A defensive copy is returned to prevent callers from modifying
     * the internal list maintained by this response object.</p>
     *
     * @return immutable list of available shipping rates
     */
    public List<QuoteItemResponse> getRates() {
        return List.copyOf(rates);
    }
}