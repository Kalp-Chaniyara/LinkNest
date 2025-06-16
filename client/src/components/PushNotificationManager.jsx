// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { BellRing, CheckCircle, XCircle } from 'lucide-react';
// import axios from 'axios';


// const PushNotificationManager = () => {
//   const dispatch = useDispatch();
//   const isLogin = useSelector((state) => state.user.isLogin);
//   const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   useEffect(() => {
//     if (isLogin) {
//       checkSubscriptionStatus();
//     }
//   }, [isLogin]);

//   const checkSubscriptionStatus = async () => {
//     if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//       return;
//     }
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();
//     setIsSubscribed(!!subscription);
//   };

//   const subscribeUser = async () => {
//     if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//       toast.error("Push notifications not supported by your browser.");
//       return;
//     }

//     const registration = await navigator.serviceWorker.ready;

//     try {
//       const subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//      //   applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY),
//           applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),

//       });

//       await axios.post('/api/auth/push/subscribe', subscription);
//       setIsSubscribed(true);
//       toast.success("Successfully subscribed to push notifications!");
//     } catch (error) {
//       console.error('Push subscription failed:', error);
//       toast.error("Failed to subscribe to push notifications.");
//     }
//   };

//   const unsubscribeUser = async () => {
//     const registration = await navigator.serviceWorker.ready;
//     const subscription = await registration.pushManager.getSubscription();

//     if (subscription) {
//       try {
//         await axios.post('/api/auth/push/unsubscribe', { endpoint: subscription.endpoint });
//         await subscription.unsubscribe();
//         setIsSubscribed(false);
//         toast.success("Successfully unsubscribed from push notifications.");
//       } catch (error) {
//         console.error('Push unsubscription failed:', error);
//         toast.error("Failed to unsubscribe from push notifications.");
//       }
//     }
//   };

//   const requestNotificationPermission = async () => {
//     const permission = await Notification.requestPermission();
//     setPermissionStatus(permission);
//     if (permission === 'granted') {
//       await subscribeUser();
//     } else {
//       toast.error("Notification permission denied.");
//     }
//   };

//   const urlBase64ToUint8Array = (base64String) => {
//     const padding = '='.repeat((4 - base64String.length % 4) % 4);
//     const base64 = (base64String + padding)
//       .replace(/\-/g, '+')
//       .replace(/_/g, '/');
//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   };

//   if (!isLogin) {
//     return null; // Don't render if user is not logged in
//   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
//         {permissionStatus === 'granted' && isSubscribed ? (
//           <div className="flex items-center text-green-600">
//             <CheckCircle className="h-5 w-5 mr-2" />
//             <span>Push Notifications Active</span>
//             <Button
//               onClick={unsubscribeUser}
//               className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
//             >
//               Disable
//             </Button>
//           </div>
//         ) : permissionStatus === 'denied' ? (
//           <div className="flex items-center text-red-600">
//             <XCircle className="h-5 w-5 mr-2" />
//             <span>Push Notifications Blocked</span>
//             <Button
//               onClick={() => toast.error("Please enable notifications in your browser settings.")}
//               className="ml-4 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
//             >
//               Manage
//             </Button>
//           </div>
//         ) : (
//           <div className="flex items-center text-blue-600">
//             <BellRing className="h-5 w-5 mr-2" />
//             <span>Enable Push Notifications?</span>
//             <Button
//               onClick={requestNotificationPermission}
//               className="ml-4 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
//             >
//               Enable
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PushNotificationManager;

import React from 'react'

function PushNotificationManager() {
  return (
    <div>PushNotificationManager</div>
  )
}

export default PushNotificationManager