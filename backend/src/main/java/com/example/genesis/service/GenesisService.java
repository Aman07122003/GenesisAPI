package com.example.genesis.service;

import com.example.genesis.client.GenesisApiClient;
import com.example.genesis.dto.request.QuoteRequest;
import com.example.genesis.dto.request.ShipmentRequest;
import com.example.genesis.dto.response.QuoteResponse;
import com.example.genesis.dto.response.ShipmentResponse;
import org.springframework.stereotype.Service;

/**
 * Service layer responsible for coordinating quotation and shipment
 * operations with the external Genesis API.
 *
 * <p>This service acts as the application layer between the REST controller
 * and {@link GenesisApiClient}. It delegates external API communication to
 * the client and keeps the controller independent of HTTP client details.</p>
 */
@Service
public final class GenesisService {

    private final GenesisApiClient client;

    /**
     * Creates the Genesis service with the required API client.
     *
     * @param client client responsible for communicating with the external
     *               Genesis API
     */
    public GenesisService(final GenesisApiClient client) {
        this.client = client;
    }

    /**
     * Creates a shipment using the supplied shipment details.
     *
     * <p>The request is delegated to the Genesis API client. The returned
     * response contains the shipment tracking information and generated
     * shipping labels.</p>
     *
     * @param request shipment request containing the selected shipping
     *                quotation and shipment details
     * @return shipment response containing tracking information and labels
     */
    public ShipmentResponse createShipment(
            final ShipmentRequest request) {

        return client.createShipment(request);
    }

    /**
     * Retrieves available shipping quotations for the supplied shipment
     * details.
     *
     * <p>The request is delegated to the Genesis API client, which handles
     * communication with the external quotation endpoint.</p>
     *
     * @param request quotation request containing the shipment details
     * @return quotation response containing the available shipping rates
     */
    public QuoteResponse getQuotes(final QuoteRequest request) {
        return client.getQuotes(request);
    }
}