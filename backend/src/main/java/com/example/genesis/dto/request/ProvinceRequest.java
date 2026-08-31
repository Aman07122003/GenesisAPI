package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Represents province or state information supplied as part of a shipping
 * address.
 *
 * <p>The province information identifies the administrative region associated
 * with an address and includes both the province code and the country code
 * required by the Genesis API.</p>
 */
public final class ProvinceRequest {

    @NotBlank
    private final String alpha2code;

    @NotBlank
    @Size(max = 3)
    private final String countryCode;

    @NotBlank
    private final String name;

    /**
     * Creates a province request using the province and country information
     * required by the Genesis API.
     *
     * <p>The constructor is used by Jackson to deserialize the nested
     * province object received from the frontend.</p>
     *
     * @param alpha2code   two-character province or state code
     * @param countryCode  country code associated with the province
     * @param name         province or state name
     */
    @JsonCreator
    public ProvinceRequest(
            @JsonProperty("alpha2code") final String alpha2code,
            @JsonProperty("countryCode") final String countryCode,
            @JsonProperty("name") final String name) {

        this.alpha2code = alpha2code;
        this.countryCode = countryCode;
        this.name = name;
    }

    /**
     * Returns the two-character province or state code.
     *
     * @return province or state code
     */
    public String getAlpha2code() {
        return alpha2code;
    }

    /**
     * Returns the country code associated with the province.
     *
     * @return country code
     */
    public String getCountryCode() {
        return countryCode;
    }

    /**
     * Returns the province or state name.
     *
     * @return province or state name
     */
    public String getName() {
        return name;
    }
}