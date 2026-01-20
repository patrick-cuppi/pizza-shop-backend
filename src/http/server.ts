import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authentication } from "./authentication";
import { approveOrder } from "./routes/approve-order-route";
import { authenticateFromLink } from "./routes/authenticate-from-link-route";
import { cancelOrder } from "./routes/cancel-order-route";
import { createEvaluation } from "./routes/create-evaluation-route";
import { createOrder } from "./routes/create-order-route";
import { deliverOrder } from "./routes/deliver-order-route";
import { dispatchOrder } from "./routes/dispatch-order-route";
import { getDailyReceiptInPeriod } from "./routes/get-daily-receipt-in-period-route";
import { getDayOrdersAmount } from "./routes/get-day-orders-amount-route";
import { getEvaluations } from "./routes/get-evaluations-route";
import { getManagedRestaurant } from "./routes/get-managed-restaurant-route";
import { getMonthCanceledOrdersAmount } from "./routes/get-month-canceled-orders-amount-route";
import { getMonthOrdersAmount } from "./routes/get-month-orders-amount-route";
import { getMonthReceipt } from "./routes/get-month-receipt-route";
import { getOrderDetails } from "./routes/get-orders-details-route";
import { getOrders } from "./routes/get-orders-route";
import { getPopularProducts } from "./routes/get-popular-products-route";
import { getProfile } from "./routes/get-profile-route";
import { registerCustomer } from "./routes/register-customer-route";
import { registerRestaurant } from "./routes/register-restaurant-route";
import { sendAuthenticationLink } from "./routes/send-authentication-link-route";
import { signOut } from "./routes/sign-out-route";
import { updateMenu } from "./routes/update-menu-route";
import { updateProfile } from "./routes/update-profile-route";

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      origin: (request): boolean => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        return true;
      },
    }),
  )
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(registerCustomer)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateMenu)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = error.status;

        return error.toResponse();
      }
      case "NOT_FOUND": {
        return new Response(null, { status: 404 });
      }
      default: {
        console.error(error);

        return new Response(null, { status: 500 });
      }
    }
  });

app.listen(3333);

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
);
