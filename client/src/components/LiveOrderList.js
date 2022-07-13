/* This example requires Tailwind CSS v2.0+ */
import {
  CheckCircleIcon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
} from "@heroicons/react/solid";

const orders = [
  {
    customer: {
      name: "Ricardo Cooper",
      email: "ricardo.cooper@example.com",
      phone: "0873566400",
    },
    items: [
      {
        title: "Large Cod",
        qty: "2",
      },
      {
        title: "Small Chips",
        qty: "5",
      },
    ],
    destination: "74 Seabury Lawns Mornington Meath",
    type: "delivery",
    date: "2020-01-07",
    dateFull: "5 mins ago",
    paymentStatus: "Payment processed",
  },
  {
    customer: {
      name: "Kristen Ramos",
      email: "kristen.ramos@example.com",
      phone: "0831568500",
    },
    items: [
      {
        title: "Battered Sausage",
        qty: "2",
      },
      {
        title: "Cheesy Chips",
        qty: "1",
      },
    ],
    date: "2020-01-07",
    dateFull: "11 mins ago",
    paymentStatus: "Payment processed",
  },
  {
    customer: {
      name: "Ted Fox",
      email: "ted.fox@example.com",
      phone: "0873523400",
    },
    items: [
      {
        title: "Large Cod",
        qty: "2",
      },
      {
        title: "Small Chips",
        qty: "2",
      },
      {
        title: "Diet Coke",
        qty: "5",
      },
      {
        title: "Cheese Burger",
        qty: "1",
      },
    ],
    date: "2020-01-07",
    dateFull: "14 mins ago",
    paymentStatus: "Payment processed",
  },
];

export default function LiveOrderList() {
  return (
    <div>
      <div className="sm:flex-auto">
        <h1 className="text-xl font-semibold text-gray-900">Live Orders</h1>
        <p className="mt-2 text-sm text-gray-700">
          Press the chevron one the right of the order once fulfilled.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md mt-3">
        <ul className="divide-y divide-gray-200">
          {orders.map((order, i) => (
            <li key={order.customer.email}>
              <a href={order.href} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {order.customer.name}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <MailIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {order.customer.email}
                          </span>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <PhoneIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {order.customer.phone}
                          </span>
                        </p>
                        <p className="text-sm text-gray-900 mt-4">
                          Ordered{" "}
                          <time dateTime={order.date}>{order.dateFull}</time>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                          {order.paymentStatus}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <div>
                          <p className="text-sm font-medium text-indigo-600">
                            Items
                          </p>
                          {order.items.map((item) => (
                            <div className="flex space-x-5 mt-2">
                              <p className="text-sm text-gray-900">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-900">
                                x {item.qty}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
