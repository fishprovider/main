// eslint-disable-next-line max-len
// import { faWallet as Wallet } from '@fishprovider/icons/assets/fontawesome/pro-duotone-svg-icons/faWallet';
// import { FontAwesomeIcon } from '@fishprovider/icons/fontawesome';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import _ from 'lodash';
import { lazy, Suspense } from 'react';

const AccountBalance = lazy(() => import('@mui/icons-material/AccountBalance'));
const AccountBalanceWallet = lazy(() => import('@mui/icons-material/AccountBalanceWallet'));
const Add = lazy(() => import('@mui/icons-material/Add'));
const AddCircle = lazy(() => import('@mui/icons-material/AddCircle'));
const AdminPanelSettings = lazy(() => import('@mui/icons-material/AdminPanelSettings'));
const Apps = lazy(() => import('@mui/icons-material/Apps'));
const ArrowBack = lazy(() => import('@mui/icons-material/ArrowBack'));
const ArrowDownward = lazy(() => import('@mui/icons-material/ArrowDownward'));
const ArrowForward = lazy(() => import('@mui/icons-material/ArrowForward'));
const ArrowUpward = lazy(() => import('@mui/icons-material/ArrowUpward'));
const BarChart = lazy(() => import('@mui/icons-material/BarChart'));
const Battery0Bar = lazy(() => import('@mui/icons-material/Battery0Bar'));
const Battery20 = lazy(() => import('@mui/icons-material/Battery20'));
const Battery50 = lazy(() => import('@mui/icons-material/Battery50'));
const Battery80 = lazy(() => import('@mui/icons-material/Battery80'));
const BatteryFull = lazy(() => import('@mui/icons-material/BatteryFull'));
const Brightness4 = lazy(() => import('@mui/icons-material/Brightness4'));
const Brightness7 = lazy(() => import('@mui/icons-material/Brightness7'));
const CandlestickChart = lazy(() => import('@mui/icons-material/CandlestickChart'));
const CheckIcon = lazy(() => import('@mui/icons-material/Check'));
const CircleOutlinedIcon = lazy(() => import('@mui/icons-material/CircleOutlined'));
const Close = lazy(() => import('@mui/icons-material/Close'));
const Comment = lazy(() => import('@mui/icons-material/Comment'));
const Computer = lazy(() => import('@mui/icons-material/Computer'));
const ContentCopy = lazy(() => import('@mui/icons-material/ContentCopy'));
const Cyclone = lazy(() => import('@mui/icons-material/Cyclone'));
const Dashboard = lazy(() => import('@mui/icons-material/Dashboard'));
const DateRange = lazy(() => import('@mui/icons-material/DateRange'));
const Delete = lazy(() => import('@mui/icons-material/Delete'));
const DeleteForever = lazy(() => import('@mui/icons-material/DeleteForever'));
const Edit = lazy(() => import('@mui/icons-material/Edit'));
const Extension = lazy(() => import('@mui/icons-material/Extension'));
const FilterAlt = lazy(() => import('@mui/icons-material/FilterAlt'));
const Forum = lazy(() => import('@mui/icons-material/Forum'));
const Fullscreen = lazy(() => import('@mui/icons-material/Fullscreen'));
const Functions = lazy(() => import('@mui/icons-material/Functions'));
const Gavel = lazy(() => import('@mui/icons-material/Gavel'));
const Handshake = lazy(() => import('@mui/icons-material/Handshake'));
const HelpOutline = lazy(() => import('@mui/icons-material/HelpOutline'));
const History = lazy(() => import('@mui/icons-material/History'));
const Info = lazy(() => import('@mui/icons-material/Info'));
const Language = lazy(() => import('@mui/icons-material/Language'));
const Layers = lazy(() => import('@mui/icons-material/Layers'));
const Lightbulb = lazy(() => import('@mui/icons-material/Lightbulb'));
const List = lazy(() => import('@mui/icons-material/List'));
const ListAlt = lazy(() => import('@mui/icons-material/ListAlt'));
const Lock = lazy(() => import('@mui/icons-material/Lock'));
const LockOpen = lazy(() => import('@mui/icons-material/LockOpen'));
const MarkChatRead = lazy(() => import('@mui/icons-material/MarkChatRead'));
const Merge = lazy(() => import('@mui/icons-material/Merge'));
const MoreHoriz = lazy(() => import('@mui/icons-material/MoreHoriz'));
const MoreVert = lazy(() => import('@mui/icons-material/MoreVert'));
const Newspaper = lazy(() => import('@mui/icons-material/Newspaper'));
const Notifications = lazy(() => import('@mui/icons-material/Notifications'));
const NotificationsActive = lazy(() => import('@mui/icons-material/NotificationsActive'));
const NotificationsNone = lazy(() => import('@mui/icons-material/NotificationsNone'));
const Pause = lazy(() => import('@mui/icons-material/Pause'));
const People = lazy(() => import('@mui/icons-material/People'));
const PeopleOutline = lazy(() => import('@mui/icons-material/PeopleOutline'));
const PhoneAndroid = lazy(() => import('@mui/icons-material/PhoneAndroid'));
const Podcasts = lazy(() => import('@mui/icons-material/Podcasts'));
const PunchClock = lazy(() => import('@mui/icons-material/PunchClock'));
const PunchClockOutlined = lazy(() => import('@mui/icons-material/PunchClockOutlined'));
const Remove = lazy(() => import('@mui/icons-material/Remove'));
const RestartAlt = lazy(() => import('@mui/icons-material/RestartAlt'));
const SafetyCheck = lazy(() => import('@mui/icons-material/SafetyCheck'));
const Save = lazy(() => import('@mui/icons-material/Save'));
const Schedule = lazy(() => import('@mui/icons-material/Schedule'));
const Security = lazy(() => import('@mui/icons-material/Security'));
const SecurityOutlined = lazy(() => import('@mui/icons-material/SecurityOutlined'));
const Send = lazy(() => import('@mui/icons-material/Send'));
const Settings = lazy(() => import('@mui/icons-material/Settings'));
const Star = lazy(() => import('@mui/icons-material/Star'));
const StarOutline = lazy(() => import('@mui/icons-material/StarOutline'));
const Sort = lazy(() => import('@mui/icons-material/Sort'));
const Sync = lazy(() => import('@mui/icons-material/Sync'));
const SystemUpdateAlt = lazy(() => import('@mui/icons-material/SystemUpdateAlt'));
const TipsAndUpdates = lazy(() => import('@mui/icons-material/TipsAndUpdates'));
const TouchApp = lazy(() => import('@mui/icons-material/TouchApp'));
const TouchAppOutlined = lazy(() => import('@mui/icons-material/TouchAppOutlined'));
const VerifiedUser = lazy(() => import('@mui/icons-material/VerifiedUser'));
const VerifiedUserOutlined = lazy(() => import('@mui/icons-material/VerifiedUserOutlined'));
const Visibility = lazy(() => import('@mui/icons-material/Visibility'));
const VisibilityOff = lazy(() => import('@mui/icons-material/VisibilityOff'));
const Wallet = lazy(() => import('@mui/icons-material/Wallet'));
const WaterfallChart = lazy(() => import('@mui/icons-material/WaterfallChart'));
const ZZZ = lazy(() => import('@mui/icons-material/CircleOutlined'));

interface Options {
  name: string,
  size?: 'small' | 'medium' | 'large' | number;
  color?: string;
}

const renderIcon = (name: string, props: SvgIconProps) => {
  switch (name) {
    case 'AccountBalance': return <AccountBalance {...props} />;
    case 'AccountBalanceWallet': return <AccountBalanceWallet {...props} />;
    case 'Add': return <Add {...props} />;
    case 'AddCircle': return <AddCircle {...props} />;
    case 'AdminPanelSettings': return <AdminPanelSettings {...props} />;
    case 'Apps': return <Apps {...props} />;
    case 'ArrowBack': return <ArrowBack {...props} />;
    case 'ArrowDownward': return <ArrowDownward {...props} />;
    case 'ArrowForward': return <ArrowForward {...props} />;
    case 'ArrowUpward': return <ArrowUpward {...props} />;
    case 'BarChart': return <BarChart {...props} />;
    case 'Battery0Bar': return <Battery0Bar {...props} />;
    case 'Battery20': return <Battery20 {...props} />;
    case 'Battery50': return <Battery50 {...props} />;
    case 'Battery80': return <Battery80 {...props} />;
    case 'BatteryFull': return <BatteryFull {...props} />;
    case 'Brightness4': return <Brightness4 {...props} />;
    case 'Brightness7': return <Brightness7 {...props} />;
    case 'CandlestickChart': return <CandlestickChart {...props} />;
    case 'Check': return <CheckIcon {...props} />;
    case 'CircleOutlinedIcon': return <CircleOutlinedIcon {...props} />;
    case 'Close': return <Close {...props} />;
    case 'Comment': return <Comment {...props} />;
    case 'Computer': return <Computer {...props} />;
    case 'ContentCopy': return <ContentCopy {...props} />;
    case 'Cyclone': return <Cyclone {...props} />;
    case 'Dashboard': return <Dashboard {...props} />;
    case 'DateRange': return <DateRange {...props} />;
    case 'Delete': return <Delete {...props} />;
    case 'DeleteForever': return <DeleteForever {...props} />;
    case 'Edit': return <Edit {...props} />;
    case 'Extension': return <Extension {...props} />;
    case 'FilterAlt': return <FilterAlt {...props} />;
    case 'Forum': return <Forum {...props} />;
    case 'Fullscreen': return <Fullscreen {...props} />;
    case 'Functions': return <Functions {...props} />;
    case 'Gavel': return <Gavel {...props} />;
    case 'Handshake': return <Handshake {...props} />;
    case 'HelpOutline': return <HelpOutline {...props} />;
    case 'History': return <History {...props} />;
    case 'Info': return <Info {...props} />;
    case 'Language': return <Language {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Lightbulb': return <Lightbulb {...props} />;
    case 'List': return <List {...props} />;
    case 'ListAlt': return <ListAlt {...props} />;
    case 'Lock': return <Lock {...props} />;
    case 'LockOpen': return <LockOpen {...props} />;
    case 'MarkChatRead': return <MarkChatRead {...props} />;
    case 'Merge': return <Merge {...props} />;
    case 'MoreHoriz': return <MoreHoriz {...props} />;
    case 'MoreVert': return <MoreVert {...props} />;
    case 'Newspaper': return <Newspaper {...props} />;
    case 'Notifications': return <Notifications {...props} />;
    case 'NotificationsActive': return <NotificationsActive {...props} />;
    case 'NotificationsNone': return <NotificationsNone {...props} />;
    case 'Pause': return <Pause {...props} />;
    case 'People': return <People {...props} />;
    case 'PeopleOutline': return <PeopleOutline {...props} />;
    case 'PhoneAndroid': return <PhoneAndroid {...props} />;
    case 'Podcasts': return <Podcasts {...props} />;
    case 'PunchClock': return <PunchClock {...props} />;
    case 'PunchClockOutlined': return <PunchClockOutlined {...props} />;
    case 'Remove': return <Remove {...props} />;
    case 'RestartAlt': return <RestartAlt {...props} />;
    case 'SafetyCheck': return <SafetyCheck {...props} />;
    case 'Save': return <Save {...props} />;
    case 'Schedule': return <Schedule {...props} />;
    case 'Security': return <Security {...props} />;
    case 'SecurityOutlined': return <SecurityOutlined {...props} />;
    case 'Send': return <Send {...props} />;
    case 'Settings': return <Settings {...props} />;
    case 'Star': return <Star {...props} />;
    case 'StarOutline': return <StarOutline {...props} />;
    case 'Sort': return <Sort {...props} />;
    case 'Sync': return <Sync {...props} />;
    case 'SystemUpdateAlt': return <SystemUpdateAlt {...props} />;
    case 'TipsAndUpdates': return <TipsAndUpdates {...props} />;
    case 'TouchApp': return <TouchApp {...props} />;
    case 'TouchAppOutlined': return <TouchAppOutlined {...props} />;
    case 'VerifiedUser': return <VerifiedUser {...props} />;
    case 'VerifiedUserOutlined': return <VerifiedUserOutlined {...props} />;
    case 'Visibility': return <Visibility {...props} />;
    case 'VisibilityOff': return <VisibilityOff {...props} />;
    // case 'Wallet': return <FontAwesomeIcon icon={Wallet} />;
    case 'Wallet': return <Wallet {...props} />;
    case 'WaterfallChart': return <WaterfallChart {...props} />;
    default: return <ZZZ {...props} />;
  }
};

const getIconComponent = ({ name, size, color }: Options) => {
  const props: SvgIconProps = {
    ...(_.isNumber(size) ? {
      style: {
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
      },
    } : {
      fontSize: size,
    }),
  };

  return (
    <Suspense fallback={null}>
      <span style={{ color }}>{renderIcon(name, props)}</span>
    </Suspense>
  );
};

export default getIconComponent;
