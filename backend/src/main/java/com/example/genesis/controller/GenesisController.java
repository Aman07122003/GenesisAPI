package com.example.genesis.controller;

import com.example.genesis.dto.request.QuoteRequest;
import com.example.genesis.dto.request.ShipmentRequest;
import com.example.genesis.dto.response.QuoteResponse;
import com.example.genesis.dto.response.ShipmentResponse;
import com.example.genesis.service.GenesisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that exposes the application's quotation and shipment
 * endpoints to the frontend.
 *
 * <p>The controller is responsible for receiving and validating incoming
 * HTTP requests and delegating the processing to {@link GenesisService}.
 * Business logic and external API communication are handled by the service
 * and API client layers respectively.</p>
 */
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public final class GenesisController {

    private final GenesisService service;

    /**
     * Creates the Genesis controller with the required service.
     *
     * @param service service responsible for coordinating Genesis API operations
     */
    public GenesisController(final GenesisService service) {
        this.service = service;
    }

    /**
     * Creates a shipment using the supplied shipment details.
     *
     * <p>The request is validated before being passed to the service.
     * The response contains the generated master tracking number and
     * shipment labels returned by the Genesis API.</p>
     *
     * @param request validated shipment request
     * @return shipment response containing tracking information and labels
     */
    @PostMapping("/shipments")
    public ShipmentResponse createShipment(
            @Valid @RequestBody final ShipmentRequest request) {

        return service.createShipment(request);
    }

    /**
     * Retrieves available shipping quotations for the supplied shipment
     * details.
     *
     * <p>The request is validated before being passed to the service.
     * The response contains the shipping rates available for the shipment.</p>
     *
     * @param request validated quotation request
     * @return quotation response containing available shipping rates
     */
    @PostMapping("/quotes")
    public QuoteResponse getQuotes(
            @Valid @RequestBody final QuoteRequest request) {

        return service.getQuotes(request);
    }
}