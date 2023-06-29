import Title from '~ui/core/Title';

// function DepthWatch() {
//   useWatchDepth();
//   return null;
// }

// const useQuotes = (depth) => {
//   const [quotes, setQuotes] = useState({ bids: [], asks: [] });

//   useEffect(() => {
//     if (depth) {
//       const { newQuotes, deletedQuotes } = depth;

//       const deletedQuotesObj = {};
//       _.forEach(deletedQuotes, (item) => {
//         deletedQuotesObj[item] = true;
//       });

//       const newBids = [];
//       const newBidsObj = {};
//       const newAsks = [];
//       const newAsksObj = {};
//       _.forEach(newQuotes, (item) => {
//         if (item.bid) {
//           newBids.push(item);
//           newBidsObj[item.bid] = true;
//         } else if (item.ask) {
//           newAsks.push(item);
//           newAsksObj[item.ask] = true;
//         }
//       });
//       _.forEach(quotes.bids, (item) => {
//         if (
//           newBids.length < 5
//           && !deletedQuotesObj[item.id]
//           && !newBidsObj[item.bid]
//         ) {
//           newBids.push(item);
//         }
//       });
//       _.forEach(quotes.asks, (item) => {
//         if (
//           newAsks.length < 5
//           && !deletedQuotesObj[item.id]
//           && !newAsksObj[item.ask]
//         ) {
//           newAsks.push(item);
//         }
//       });

//       if (
//         newBids.length !== quotes.bids.length
//         || _.difference(newBids, quotes.bids).length
//         || newAsks.length !== quotes.asks.length
//         || _.difference(newAsks, quotes.asks).length
//       ) {
//         setQuotes({
//           bids: _.orderBy(newBids, ['bid'], ['desc']),
//           asks: _.orderBy(newAsks, ['ask'], ['asc']),
//         });
//       }
//     } else {
//       setQuotes({ bids: [], asks: [] });
//     }
//   }, [depth]);

//   return quotes;
// };

// function Depth({ symbol }) {
//   const activeProvider = useStore((states) => states.user.activeProvider);
//   const { providerType } = activeProvider;
//   const depth = useStore((states) => states.depths[symbol]);
//   const { bids, asks } = useQuotes(depth);

//   return (
//     <>
//       <DepthWatch />
//       <Box display="flex" flexWrap="wrap" height={200} overflow="auto">
//         <Box mr={2}>
//           <Box display="flex" justifyContent="space-between">
//             <Box pr={1}>Bids</Box>
//             <Box>Lots</Box>
//           </Box>
//           {_.map(bids, (item) => (
//             <Box key={item.id} display="flex" justifyContent="space-between">
//               <Box mr={1}>{item.bid}</Box>
//               <Box>
//                 {getLotFromVolume({
//                   providerType,
//                   symbol,
//                   volume: item.size,
//                 })}
//               </Box>
//             </Box>
//           ))}
//         </Box>
//         <Box>
//           <Box display="flex" justifyContent="space-between">
//             <Box pr={1}>Asks</Box>
//             <Box>Lots</Box>
//           </Box>
//           {_.map(asks, (item) => (
//             <Box key={item.id} display="flex" justifyContent="space-between">
//               <Box mr={1}>{item.ask}</Box>
//               <Box>
//                 {getLotFromVolume({
//                   providerType,
//                   symbol,
//                   volume: item.size,
//                 })}
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     </>
//   );
// }

function UserWrapper() {
  return (
    <div>
      <Title size="h3">🚧 Market Depth</Title>
      Coming soon...
      {/* <Depth symbol={symbol} /> */}
    </div>
  );
}

export default UserWrapper;
