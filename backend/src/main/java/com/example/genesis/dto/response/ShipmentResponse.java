package com.example.genesis.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Represents the shipment response returned by the Genesis shipment API.
 *
 * <p>The response contains the master tracking number assigned to the
 * shipment and the shipping labels generated for its individual packages.
 * Each label is represented by a {@link LabelResponse} containing the
 * label document content, package dimensions, weight information, and
 * package tracking number.</p>
 *
 * <p>The labels are stored as an immutable list to prevent callers from
 * modifying the response data after it has been created.</p>
 */
@SuppressWarnings("LombokGetterMayBeUsed")
public final class ShipmentResponse {

    private final List<LabelResponse> labels;
    private final String masterTrackingNumber;

    /**
     * Creates a shipment response from the response returned by the
     * Genesis shipment API.
     *
     * <p>If the API does not return any labels, a null value is converted
     * to an empty list so that callers can safely iterate over the labels
     * without performing a null check.</p>
     *
     * @param labels                shipping labels generated for the shipment
     * @param masterTrackingNumber  master tracking number assigned to the
     *                              shipment
     */
    @JsonCreator
    public ShipmentResponse(
            @JsonProperty("labels") final List<LabelResponse> labels,
            @JsonProperty("masterTrackingNumber")
            final String masterTrackingNumber) {

        this.labels = labels == null ? List.of() : List.copyOf(labels);
        this.masterTrackingNumber = masterTrackingNumber;
    }

    /**
     * Returns the shipping labels generated for the shipment.
     *
     * <p>A defensive copy is returned to prevent callers from modifying
     * the internal list maintained by this response object.</p>
     *
     * @return immutable list of generated shipping labels
     */
    public List<LabelResponse> getLabels() {
        return List.copyOf(labels);
    }

    /**
     * Returns the master tracking number assigned to the shipment.
     *
     * <p>The master tracking number identifies the shipment as a whole,
     * while individual {@link LabelResponse} objects may contain their
     * own package-level tracking numbers.</p>
     *
     * @return master shipment tracking number
     */
    public String getMasterTrackingNumber() {
        return masterTrackingNumber;
    }
}