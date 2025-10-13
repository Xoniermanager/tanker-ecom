const { mainfreightApi } = require("../utils/axios-api");
const customError = require("../utils/error");
const { calculatePickupDateTime } = require(`../utils/pickup-date-time`);

class ShippingRateService {
  constructor() {}

  getShippingRate = async (payload) => {
    try {
      const pickupDate = calculatePickupDateTime(1);

      const newPayload = {
        account: {
          code: process.env.MAINFREIGHT_ACCOUNT_CODE,
        },
        serviceLevel: {
          code: "LCL",
        },
        origin: {
            freightRequiredDateTime: pickupDate,
            freightRequiredDateTimeZone: "New Zealand Standard Time",
            address:{
                suburb: "Cannons Creek",
                postCode: "5022",
                city: "Auckland",
                countryCode: "NZ"
            }
        },
        destination: payload.destination,
        freightDetails: payload.freightDetails,
      };

      console.log("new payload: ", newPayload)

      const response = await mainfreightApi.post(
        `/Rate?region=${process.env.TRANSPORT_REGION}`, 
        newPayload
      );
      
      
      if (!response.data) {
        throw customError("Shipping charges not fetched", 400);
      }

      return response.data; 
      
    } catch (error) {
      
      if (error.response) {
        
        throw customError(
          error.response.data?.message || "Failed to fetch shipping rates",
          error.response.status
        );
      } else if (error.request) {
        
        throw customError("No response from shipping service", 503);
      } else {
        
        throw error;
      }
    }
  };
}

const shippingRateService = new ShippingRateService();

module.exports = shippingRateService;
