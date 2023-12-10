// @ts-nocheck
import './App.css';
import { Suspense, useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './Pages/HomePage/Home';
import { ChakraProvider } from '@chakra-ui/react';
import IncomingOrders from './Pages/OrderManagement/IncomingOrders';
import { ToastContainer } from 'react-toastify';
import Incoming from './Pages/InTransit/Incoming';
import Login from './Pages/Auth/Login';
import Outgoing from './Pages/InTransit/Outgoing';
import SelfPickup from './Pages/SelfPickup/SelfPickup';
import Completed from './Pages/Completed/Completed';
import Cancelled from './Pages/Cancelled/Cancelled';
import ReadyToShip from './Pages/ReadyToShip/ReadyToShip';
import DirectDelivery from './Pages/ReadyToShip/DirectDelivery';
import Received from './Pages/OrderManagement(Puerto Rico)/Received';
import AwaitingDriver from './Pages/OrderManagement(Puerto Rico)/AwaitingDriver';
import OnTheWay from './Pages/OrderManagement(Puerto Rico)/OnTheWay';
import PendingLabel from './Pages/OrderManagement/PendingLabel';
import AwaitingConsolidation from './Pages/OrderManagement/AwaitingConsolidation';
import AllOrders from './Pages/OrderManagement/AllOrders';
import PendingPayments from './Pages/OrderManagement/PendingPayments';
import AllOutgoingOrders from './Pages/OrderManagement(Puerto Rico)/AllOutgoingOrders';
import CreateDriverOne from './Pages/Drivers/CreateDriverOne';
import CreateDriverTwo from './Pages/Drivers/CreateDriverTwo';
import CreateDriverThree from './Pages/Drivers/CreateDriverThree';
import Drivers from './Pages/Drivers/Drivers';
import DriverDetails from './Pages/Drivers/DriverDetails';
import IncomingOrdersDetails from './Pages/OrderManagement/IncomingOrdersDetails';
import PendingLabelDetails from './Pages/OrderManagement/PendingLabelDetails';
import PendingPaymentDetails from './Pages/OrderManagement/PendingPaymentDetails';
import ReadyToShipDetails from './Pages/ReadyToShip/ReadyToShipDetails';
import AwaitingConsolidationDetails from './Pages/OrderManagement/AwaitingConsolidationDetails';
import CancelledDetails from './Pages/Cancelled/CancelledDetails';
import DirectDeliveryOrders from './Pages/DirectDelivery/DirectDeliveryOrders';
import IncomingDetails from './Pages/InTransit/IncomingDetails';
import OrderTracking from './Pages/Tracking/OrderTracking';
import BookingDetails from './Pages/Tracking/BookingDetails';
import ReceivedDetails from './Pages/OrderManagement(Puerto Rico)/ReceivedDetails';
import AwaitingDriverDetails from './Pages/OrderManagement(Puerto Rico)/AwaitingDriverDetails';
import OnTheWayDetails from './Pages/OrderManagement(Puerto Rico)/OnTheWayDetails';
import IncomingCompletedDetails from './Pages/InTransit/IncomingCompletedDetails';
import OutgoingDetails from './Pages/InTransit/OutgoingDetails';
import OutgoingCompletedDetails from './Pages/InTransit/OutgoingCompletedDetails';
import DirectDeliveryDetails from './Pages/DirectDelivery/DirectDeliveryDetails';
import SelfPickupDetails from './Pages/SelfPickup/SelfPickupDetails';
import PickedByCustomerDetails from './Pages/SelfPickup/PickedByCustomerDetails';
import CompletedDetails from './Pages/Completed/CompletedDetails';
import ProtectedRoute from './Utilities/ProtectedRoute';
import NoInternet from './Pages/Errors/NoInternet';
import UpdateDriverInfo from './Pages/Drivers/UpdateDriverInfo';
import UpdateDriverVehicleInfo from './Pages/Drivers/UpdateDriverVehicleInfo';
import UpdateLicenseInfo from './Pages/Drivers/UpdateLicenseInfo';
import VirtualBoxNumberTracking from './Pages/VirtualBoxNumber/VirtualBoxNumberTracking';
import VirtualBoxNumberDetails from './Pages/VirtualBoxNumber/VirtualBoxNumberDetails';
import VirtualBookingDetails from './Pages/VirtualBoxNumber/VirtualBookingDetails';
import ByWarehouseDelivery from './Pages/ReadyToShip/ByWarehouseDelivery';



export default function App() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  useEffect(() => {
    function handleOnlineStatusChange() {
      setIsOnline(window.navigator.onLine);
    }

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);
  return (
    <>
      {isOnline ? (<section className='font-switzer'>
        <Suspense fallback="loading">
          <ToastContainer />
          <ChakraProvider>
            <Router>
              <Routes>
                <Route exact path="/sign-in" element={<Login />} />
                <Route exact path='/' element={<ProtectedRoute Component={Home} />} />
                <Route exact path='/track-order' element={<ProtectedRoute Component={OrderTracking} />} />
                <Route exact path='/track-virtualbox-number' element={<ProtectedRoute Component={VirtualBoxNumberTracking} />} />
                <Route exact path='/virtualbox-number-details' element={<ProtectedRoute Component={VirtualBoxNumberDetails} />} />
                <Route exact path='/virtual-booking-details' element={<ProtectedRoute Component={VirtualBookingDetails} />} />
                <Route exact path='/booking-details' element={<ProtectedRoute Component={BookingDetails} />} />
                <Route exact path='/all-orders' element={<ProtectedRoute Component={AllOrders} />} />
                <Route exact path='/incoming' element={<ProtectedRoute Component={IncomingOrders} />} />
                <Route exact path='/incoming-details' element={<ProtectedRoute Component={IncomingOrdersDetails} />} />
                <Route exact path='/pending-label' element={<ProtectedRoute Component={PendingLabel} />} />
                <Route exact path='/pending-label-details' element={<ProtectedRoute Component={PendingLabelDetails} />} />
                <Route exact path='/awaiting-consolidation' element={<ProtectedRoute Component={AwaitingConsolidation} />} />
                <Route exact path='/awaiting-consolidation-details' element={<ProtectedRoute Component={AwaitingConsolidationDetails} />} />
                <Route exact path='/pending-payments' element={<ProtectedRoute Component={PendingPayments} />} />
                <Route exact path='/pending-payment-details' element={<ProtectedRoute Component={PendingPaymentDetails} />} />
                <Route exact path='/ready-to-ship' element={<ProtectedRoute Component={ReadyToShip} />} />
                <Route exact path='/direct-delivery' element={<ProtectedRoute Component={DirectDelivery} />} />
                <Route exact path='/by-warehouse-delivery' element={<ProtectedRoute Component={ByWarehouseDelivery} />} />
                <Route exact path='/ready-to-ship-details' element={<ProtectedRoute Component={ReadyToShipDetails} />} />
                <Route exact path='/outgoing-package' element={<ProtectedRoute Component={AllOutgoingOrders} />} />
                <Route exact path='/received' element={<ProtectedRoute Component={Received} />} />
                <Route exact path='/received-details' element={<ProtectedRoute Component={ReceivedDetails} />} />
                <Route exact path='/awaiting-driver' element={<ProtectedRoute Component={AwaitingDriver} />} />
                <Route exact path='/awaiting-driver-details' element={<ProtectedRoute Component={AwaitingDriverDetails} />} />
                <Route exact path='/on-the-way' element={<ProtectedRoute Component={OnTheWay} />} />
                <Route exact path='/on-the-way-details' element={<ProtectedRoute Component={OnTheWayDetails} />} />
                <Route exact path='/intransit/incoming' element={<ProtectedRoute Component={Incoming} />} />
                <Route exact path='/intransit/incoming-details' element={<ProtectedRoute Component={IncomingDetails} />} />
                <Route exact path='/intransit/incoming-completed-details' element={<ProtectedRoute Component={IncomingCompletedDetails} />} />
                <Route exact path='/intransit/outgoing' element={<ProtectedRoute Component={Outgoing} />} />
                <Route exact path='/intransit/outgoing-details' element={<ProtectedRoute Component={OutgoingDetails} />} />
                <Route exact path='/intransit/outgoing-completed-details' element={<ProtectedRoute Component={OutgoingCompletedDetails} />} />
                <Route exact path='/self-pickup' element={<ProtectedRoute Component={SelfPickup} />} />
                <Route exact path='/self-pickup-details' element={<ProtectedRoute Component={SelfPickupDetails} />} />
                <Route exact path='/picked-by-customer-details' element={<ProtectedRoute Component={PickedByCustomerDetails} />} />
                <Route exact path='/direct-delivery-orders' element={<ProtectedRoute Component={DirectDeliveryOrders} />} />
                <Route exact path='/direct-delivery-details' element={<ProtectedRoute Component={DirectDeliveryDetails} />} />
                <Route exact path='/completed' element={<ProtectedRoute Component={Completed} />} />
                <Route exact path='/completed-details' element={<ProtectedRoute Component={CompletedDetails} />} />
                <Route exact path='/cancelled' element={<ProtectedRoute Component={Cancelled} />} />
                <Route exact path='/cancelled-details' element={<ProtectedRoute Component={CancelledDetails} />} />
                <Route exact path='/drivers' element={<ProtectedRoute Component={Drivers} />} />
                <Route exact path='/driver-details' element={<ProtectedRoute Component={DriverDetails} />} />
                <Route exact path='/create-driver/step-one' element={<ProtectedRoute Component={CreateDriverOne} />} />
                <Route exact path='/create-driver/step-two' element={<ProtectedRoute Component={CreateDriverTwo} />} />
                <Route exact path='/create-driver/step-three' element={<ProtectedRoute Component={CreateDriverThree} />} />
                <Route exact path='/update/driver-profile' element={<ProtectedRoute Component={UpdateDriverInfo} />} />
                <Route exact path='/update/driver-vehicle-info' element={<ProtectedRoute Component={UpdateDriverVehicleInfo} />} />
                <Route exact path='/update/driver-license-info' element={<ProtectedRoute Component={UpdateLicenseInfo} />} />
              </Routes>
            </Router>
          </ChakraProvider>
        </Suspense>
      </section>) : (
        <NoInternet />
      )}

    </>
  );
}

