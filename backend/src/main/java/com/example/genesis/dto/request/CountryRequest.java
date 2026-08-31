package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Represents country information supplied as part of a shipping address.
 *
 * <p>The Genesis API identifies countries using a country code, such as
 * {@code CA} for Canada. This DTO is used as the nested country object
 * within an {@link AddressRequest}.</p>
 */
public final class CountryRequest {

    @NotBlank
    @Size(max = 3)
    private final String name;

    /**
     * Creates a country request using the country code required by
     * the Genesis API.
     *
     * <p>The constructor is used by Jackson to deserialize the nested
     * country object received from the frontend.</p>
     *
     * @param name country code used to identify the country
     */
    @JsonCreator
    public CountryRequest(
            @JsonProperty("name") final String name) {

        this.name = name;
    }

    /**
     * Returns the country code.
     *
     * @return Genesis country code
     */
    public String getName() {
        return name;
    }
}
