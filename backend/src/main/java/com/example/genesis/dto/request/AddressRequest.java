package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Represents a shipping address supplied as part of a quotation request.
 *
 * <p>This DTO contains the contact, location, and geographic information
 * required by the Genesis quotation API for either the shipment origin
 * or destination. It is used for both the {@code shipFrom} and
 * {@code shipTo} addresses in a {@link QuoteRequest}.</p>
 *
 * <p>Validation annotations are applied to ensure that required address
 * information is present and that nested country and province objects
 * are validated before the request is forwarded to the Genesis API.</p>
 */
public final class AddressRequest {

    @NotBlank
    private final String address1;

    @NotBlank
    private final String alphaNumericPostalCode;

    @NotBlank
    private final String attention;

    @NotBlank
    private final String cityName;

    @NotBlank
    private final String company;

    @NotBlank
    @Size(max = 3)
    private final String countryCode;

    @Valid
    @NotNull
    private final CountryRequest countryDTO;

    @NotBlank
    private final String countryName;

    @Email
    @NotBlank
    private final String email;

    @NotBlank
    private final String phone;

    @NotBlank
    private final String postalCode;

    @Valid
    @NotNull
    private final ProvinceRequest provinceDTO;

    @NotBlank
    private final String provinceName;

    /**
     * Creates an address request with the contact and geographic information
     * required by the Genesis quotation API.
     *
     * <p>The constructor is used by Jackson to deserialize the JSON request
     * received from the frontend. Each parameter is explicitly mapped to
     * its corresponding JSON property using {@link JsonProperty}.</p>
     *
     * @param address1               primary street address
     * @param alphaNumericPostalCode normalized alphanumeric postal code
     * @param attention              name of the person receiving or sending
     *                               the shipment
     * @param cityName               city associated with the address
     * @param company                company associated with the shipment address
     * @param countryCode            ISO country code for the address
     * @param countryDTO             country information required by Genesis
     * @param countryName            full country name
     * @param email                  contact email address
     * @param phone                  contact telephone number
     * @param postalCode             postal code associated with the address
     * @param provinceDTO            province or state information required
     *                               by Genesis
     * @param provinceName           province or state name
     */
    @JsonCreator
    public AddressRequest(
            @JsonProperty("address1") final String address1,
            @JsonProperty("alphaNumericPostalCode")
            final String alphaNumericPostalCode,
            @JsonProperty("attention") final String attention,
            @JsonProperty("cityName") final String cityName,
            @JsonProperty("company") final String company,
            @JsonProperty("countryCode") final String countryCode,
            @JsonProperty("countryDTO") final CountryRequest countryDTO,
            @JsonProperty("countryName") final String countryName,
            @JsonProperty("email") final String email,
            @JsonProperty("phone") final String phone,
            @JsonProperty("postalCode") final String postalCode,
            @JsonProperty("provinceDTO") final ProvinceRequest provinceDTO,
            @JsonProperty("provinceName") final String provinceName) {

        this.address1 = address1;
        this.alphaNumericPostalCode = alphaNumericPostalCode;
        this.attention = attention;
        this.cityName = cityName;
        this.company = company;
        this.countryCode = countryCode;
        this.countryDTO = countryDTO;
        this.countryName = countryName;
        this.email = email;
        this.phone = phone;
        this.postalCode = postalCode;
        this.provinceDTO = provinceDTO;
        this.provinceName = provinceName;
    }

    /**
     * Returns the primary street address.
     *
     * @return primary street address
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * Returns the normalized alphanumeric postal code.
     *
     * @return normalized postal code
     */
    public String getAlphaNumericPostalCode() {
        return alphaNumericPostalCode;
    }

    /**
     * Returns the name of the person associated with the shipment address.
     *
     * @return contact or attention name
     */
    public String getAttention() {
        return attention;
    }

    /**
     * Returns the city associated with the shipment address.
     *
     * @return city name
     */
    public String getCityName() {
        return cityName;
    }

    /**
     * Returns the company associated with the shipment address.
     *
     * @return company name
     */
    public String getCompany() {
        return company;
    }

    /**
     * Returns the ISO country code associated with the address.
     *
     * @return country code
     */
    public String getCountryCode() {
        return countryCode;
    }

    /**
     * Returns the detailed country information required by the Genesis API.
     *
     * @return country request details
     */
    public CountryRequest getCountryDTO() {
        return countryDTO;
    }

    /**
     * Returns the full country name associated with the address.
     *
     * @return country name
     */
    public String getCountryName() {
        return countryName;
    }

    /**
     * Returns the contact email address.
     *
     * @return contact email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Returns the contact telephone number.
     *
     * @return contact phone number
     */
    public String getPhone() {
        return phone;
    }

    /**
     * Returns the postal code associated with the address.
     *
     * @return postal code
     */
    public String getPostalCode() {
        return postalCode;
    }

    /**
     * Returns the detailed province or state information required by
     * the Genesis API.
     *
     * @return province request details
     */
    public ProvinceRequest getProvinceDTO() {
        return provinceDTO;
    }

    /**
     * Returns the full province or state name associated with the address.
     *
     * @return province or state name
     */
    public String getProvinceName() {
        return provinceName;
    }
}