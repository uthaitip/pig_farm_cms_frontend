/// [name] match in ["@heroicons/vue/24/outline", "@heroicons/vue/24/solid"]
import * as IconOutline from "@heroicons/vue/24/outline";
import * as IconSolid from "@heroicons/vue/24/solid";

export function getIcon(name: string, type: "outline" | "solid" | string | String = "outline") {
  var nameIcon = name;
  if (/^[a-z0-9-]+$/g.test(name)) {
    nameIcon = name
      .split("-")
      .map((e) => `${e.substring(0, 1).toLocaleUpperCase()}${e.substring(1)}`)
      .join("");
    nameIcon = `${nameIcon}Icon`;
  }
  if (!!heroIcons[nameIcon]) {
    return type == "solid"
      ? heroIcons[nameIcon].solid
      : heroIcons[nameIcon].outline;
  }
  return IconSolid.HomeIcon;
}

export const heroIcons: any = {
  AcademicCapIcon: {
    outline: IconOutline.AcademicCapIcon,
    solid: IconSolid.AcademicCapIcon,
  },
  AdjustmentsHorizontalIcon: {
    outline: IconOutline.AdjustmentsHorizontalIcon,
    solid: IconSolid.AdjustmentsHorizontalIcon,
  },
  AdjustmentsVerticalIcon: {
    outline: IconOutline.AdjustmentsVerticalIcon,
    solid: IconSolid.AdjustmentsVerticalIcon,
  },
  ArchiveBoxArrowDownIcon: {
    outline: IconOutline.ArchiveBoxArrowDownIcon,
    solid: IconSolid.ArchiveBoxArrowDownIcon,
  },
  ArchiveBoxXMarkIcon: {
    outline: IconOutline.ArchiveBoxXMarkIcon,
    solid: IconSolid.ArchiveBoxXMarkIcon,
  },
  ArchiveBoxIcon: {
    outline: IconOutline.ArchiveBoxIcon,
    solid: IconSolid.ArchiveBoxIcon,
  },
  ArrowDownCircleIcon: {
    outline: IconOutline.ArrowDownCircleIcon,
    solid: IconSolid.ArrowDownCircleIcon,
  },
  ArrowDownLeftIcon: {
    outline: IconOutline.ArrowDownLeftIcon,
    solid: IconSolid.ArrowDownLeftIcon,
  },
  ArrowDownOnSquareStackIcon: {
    outline: IconOutline.ArrowDownOnSquareStackIcon,
    solid: IconSolid.ArrowDownOnSquareStackIcon,
  },
  ArrowDownOnSquareIcon: {
    outline: IconOutline.ArrowDownOnSquareIcon,
    solid: IconSolid.ArrowDownOnSquareIcon,
  },
  ArrowDownRightIcon: {
    outline: IconOutline.ArrowDownRightIcon,
    solid: IconSolid.ArrowDownRightIcon,
  },
  ArrowDownTrayIcon: {
    outline: IconOutline.ArrowDownTrayIcon,
    solid: IconSolid.ArrowDownTrayIcon,
  },
  ArrowDownIcon: {
    outline: IconOutline.ArrowDownIcon,
    solid: IconSolid.ArrowDownIcon,
  },
  ArrowLeftCircleIcon: {
    outline: IconOutline.ArrowLeftCircleIcon,
    solid: IconSolid.ArrowLeftCircleIcon,
  },
  ArrowLeftOnRectangleIcon: {
    outline: IconOutline.ArrowLeftOnRectangleIcon,
    solid: IconSolid.ArrowLeftOnRectangleIcon,
  },
  ArrowLeftIcon: {
    outline: IconOutline.ArrowLeftIcon,
    solid: IconSolid.ArrowLeftIcon,
  },
  ArrowLongDownIcon: {
    outline: IconOutline.ArrowLongDownIcon,
    solid: IconSolid.ArrowLongDownIcon,
  },
  ArrowLongLeftIcon: {
    outline: IconOutline.ArrowLongLeftIcon,
    solid: IconSolid.ArrowLongLeftIcon,
  },
  ArrowLongRightIcon: {
    outline: IconOutline.ArrowLongRightIcon,
    solid: IconSolid.ArrowLongRightIcon,
  },
  ArrowLongUpIcon: {
    outline: IconOutline.ArrowLongUpIcon,
    solid: IconSolid.ArrowLongUpIcon,
  },
  ArrowPathRoundedSquareIcon: {
    outline: IconOutline.ArrowPathRoundedSquareIcon,
    solid: IconSolid.ArrowPathRoundedSquareIcon,
  },
  ArrowPathIcon: {
    outline: IconOutline.ArrowPathIcon,
    solid: IconSolid.ArrowPathIcon,
  },
  ArrowRightCircleIcon: {
    outline: IconOutline.ArrowRightCircleIcon,
    solid: IconSolid.ArrowRightCircleIcon,
  },
  ArrowRightOnRectangleIcon: {
    outline: IconOutline.ArrowRightOnRectangleIcon,
    solid: IconSolid.ArrowRightOnRectangleIcon,
  },
  ArrowRightIcon: {
    outline: IconOutline.ArrowRightIcon,
    solid: IconSolid.ArrowRightIcon,
  },
  ArrowSmallDownIcon: {
    outline: IconOutline.ArrowSmallDownIcon,
    solid: IconSolid.ArrowSmallDownIcon,
  },
  ArrowSmallLeftIcon: {
    outline: IconOutline.ArrowSmallLeftIcon,
    solid: IconSolid.ArrowSmallLeftIcon,
  },
  ArrowSmallRightIcon: {
    outline: IconOutline.ArrowSmallRightIcon,
    solid: IconSolid.ArrowSmallRightIcon,
  },
  ArrowSmallUpIcon: {
    outline: IconOutline.ArrowSmallUpIcon,
    solid: IconSolid.ArrowSmallUpIcon,
  },
  ArrowTopRightOnSquareIcon: {
    outline: IconOutline.ArrowTopRightOnSquareIcon,
    solid: IconSolid.ArrowTopRightOnSquareIcon,
  },
  ArrowTrendingDownIcon: {
    outline: IconOutline.ArrowTrendingDownIcon,
    solid: IconSolid.ArrowTrendingDownIcon,
  },
  ArrowTrendingUpIcon: {
    outline: IconOutline.ArrowTrendingUpIcon,
    solid: IconSolid.ArrowTrendingUpIcon,
  },
  ArrowUpCircleIcon: {
    outline: IconOutline.ArrowUpCircleIcon,
    solid: IconSolid.ArrowUpCircleIcon,
  },
  ArrowUpLeftIcon: {
    outline: IconOutline.ArrowUpLeftIcon,
    solid: IconSolid.ArrowUpLeftIcon,
  },
  ArrowUpOnSquareStackIcon: {
    outline: IconOutline.ArrowUpOnSquareStackIcon,
    solid: IconSolid.ArrowUpOnSquareStackIcon,
  },
  ArrowUpOnSquareIcon: {
    outline: IconOutline.ArrowUpOnSquareIcon,
    solid: IconSolid.ArrowUpOnSquareIcon,
  },
  ArrowUpRightIcon: {
    outline: IconOutline.ArrowUpRightIcon,
    solid: IconSolid.ArrowUpRightIcon,
  },
  ArrowUpTrayIcon: {
    outline: IconOutline.ArrowUpTrayIcon,
    solid: IconSolid.ArrowUpTrayIcon,
  },
  ArrowUpIcon: {
    outline: IconOutline.ArrowUpIcon,
    solid: IconSolid.ArrowUpIcon,
  },
  ArrowUturnDownIcon: {
    outline: IconOutline.ArrowUturnDownIcon,
    solid: IconSolid.ArrowUturnDownIcon,
  },
  ArrowUturnLeftIcon: {
    outline: IconOutline.ArrowUturnLeftIcon,
    solid: IconSolid.ArrowUturnLeftIcon,
  },
  ArrowUturnRightIcon: {
    outline: IconOutline.ArrowUturnRightIcon,
    solid: IconSolid.ArrowUturnRightIcon,
  },
  ArrowUturnUpIcon: {
    outline: IconOutline.ArrowUturnUpIcon,
    solid: IconSolid.ArrowUturnUpIcon,
  },
  ArrowsPointingInIcon: {
    outline: IconOutline.ArrowsPointingInIcon,
    solid: IconSolid.ArrowsPointingInIcon,
  },
  ArrowsPointingOutIcon: {
    outline: IconOutline.ArrowsPointingOutIcon,
    solid: IconSolid.ArrowsPointingOutIcon,
  },
  ArrowsRightLeftIcon: {
    outline: IconOutline.ArrowsRightLeftIcon,
    solid: IconSolid.ArrowsRightLeftIcon,
  },
  ArrowsUpDownIcon: {
    outline: IconOutline.ArrowsUpDownIcon,
    solid: IconSolid.ArrowsUpDownIcon,
  },
  AtSymbolIcon: {
    outline: IconOutline.AtSymbolIcon,
    solid: IconSolid.AtSymbolIcon,
  },
  BackspaceIcon: {
    outline: IconOutline.BackspaceIcon,
    solid: IconSolid.BackspaceIcon,
  },
  BackwardIcon: {
    outline: IconOutline.BackwardIcon,
    solid: IconSolid.BackwardIcon,
  },
  BanknotesIcon: {
    outline: IconOutline.BanknotesIcon,
    solid: IconSolid.BanknotesIcon,
  },
  Bars2Icon: { outline: IconOutline.Bars2Icon, solid: IconSolid.Bars2Icon },

  Bars3BottomLeftIcon: {
    outline: IconOutline.Bars3BottomLeftIcon,
    solid: IconSolid.Bars3BottomLeftIcon,
  },
  Bars3BottomRightIcon: {
    outline: IconOutline.Bars3BottomRightIcon,
    solid: IconSolid.Bars3BottomRightIcon,
  },
  Bars3CenterLeftIcon: {
    outline: IconOutline.Bars3CenterLeftIcon,
    solid: IconSolid.Bars3CenterLeftIcon,
  },
  Bars3Icon: { outline: IconOutline.Bars3Icon, solid: IconSolid.Bars3Icon },
  Bars4Icon: { outline: IconOutline.Bars4Icon, solid: IconSolid.Bars4Icon },

  BarsArrowDownIcon: {
    outline: IconOutline.BarsArrowDownIcon,
    solid: IconSolid.BarsArrowDownIcon,
  },
  BarsArrowUpIcon: {
    outline: IconOutline.BarsArrowUpIcon,
    solid: IconSolid.BarsArrowUpIcon,
  },
  Battery0Icon: {
    outline: IconOutline.Battery0Icon,
    solid: IconSolid.Battery0Icon,
  },
  Battery100Icon: {
    outline: IconOutline.Battery100Icon,
    solid: IconSolid.Battery100Icon,
  },
  Battery50Icon: {
    outline: IconOutline.Battery50Icon,
    solid: IconSolid.Battery50Icon,
  },
  BeakerIcon: {
    outline: IconOutline.BeakerIcon,
    solid: IconSolid.BeakerIcon,
  },
  BellAlertIcon: {
    outline: IconOutline.BellAlertIcon,
    solid: IconSolid.BellAlertIcon,
  },
  BellSlashIcon: {
    outline: IconOutline.BellSlashIcon,
    solid: IconSolid.BellSlashIcon,
  },
  BellSnoozeIcon: {
    outline: IconOutline.BellSnoozeIcon,
    solid: IconSolid.BellSnoozeIcon,
  },
  BellIcon: { outline: IconOutline.BellIcon, solid: IconSolid.BellIcon },

  BoltSlashIcon: {
    outline: IconOutline.BoltSlashIcon,
    solid: IconSolid.BoltSlashIcon,
  },
  BoltIcon: { outline: IconOutline.BoltIcon, solid: IconSolid.BoltIcon },

  BookOpenIcon: {
    outline: IconOutline.BookOpenIcon,
    solid: IconSolid.BookOpenIcon,
  },
  BookmarkSlashIcon: {
    outline: IconOutline.BookmarkSlashIcon,
    solid: IconSolid.BookmarkSlashIcon,
  },
  BookmarkSquareIcon: {
    outline: IconOutline.BookmarkSquareIcon,
    solid: IconSolid.BookmarkSquareIcon,
  },
  BookmarkIcon: {
    outline: IconOutline.BookmarkIcon,
    solid: IconSolid.BookmarkIcon,
  },
  BriefcaseIcon: {
    outline: IconOutline.BriefcaseIcon,
    solid: IconSolid.BriefcaseIcon,
  },
  BugAntIcon: {
    outline: IconOutline.BugAntIcon,
    solid: IconSolid.BugAntIcon,
  },
  BuildingLibraryIcon: {
    outline: IconOutline.BuildingLibraryIcon,
    solid: IconSolid.BuildingLibraryIcon,
  },
  BuildingOffice2Icon: {
    outline: IconOutline.BuildingOffice2Icon,
    solid: IconSolid.BuildingOffice2Icon,
  },
  BuildingOfficeIcon: {
    outline: IconOutline.BuildingOfficeIcon,
    solid: IconSolid.BuildingOfficeIcon,
  },
  BuildingStorefrontIcon: {
    outline: IconOutline.BuildingStorefrontIcon,
    solid: IconSolid.BuildingStorefrontIcon,
  },
  CakeIcon: { outline: IconOutline.CakeIcon, solid: IconSolid.CakeIcon },

  CalculatorIcon: {
    outline: IconOutline.CalculatorIcon,
    solid: IconSolid.CalculatorIcon,
  },
  CalendarDaysIcon: {
    outline: IconOutline.CalendarDaysIcon,
    solid: IconSolid.CalendarDaysIcon,
  },
  CalendarIcon: {
    outline: IconOutline.CalendarIcon,
    solid: IconSolid.CalendarIcon,
  },
  CameraIcon: {
    outline: IconOutline.CameraIcon,
    solid: IconSolid.CameraIcon,
  },
  ChartBarSquareIcon: {
    outline: IconOutline.ChartBarSquareIcon,
    solid: IconSolid.ChartBarSquareIcon,
  },
  ChartBarIcon: {
    outline: IconOutline.ChartBarIcon,
    solid: IconSolid.ChartBarIcon,
  },
  ChartPieIcon: {
    outline: IconOutline.ChartPieIcon,
    solid: IconSolid.ChartPieIcon,
  },
  ChatBubbleBottomCenterTextIcon: {
    outline: IconOutline.ChatBubbleBottomCenterTextIcon,
    solid: IconSolid.ChatBubbleBottomCenterTextIcon,
  },
  ChatBubbleBottomCenterIcon: {
    outline: IconOutline.ChatBubbleBottomCenterIcon,
    solid: IconSolid.ChatBubbleBottomCenterIcon,
  },
  ChatBubbleLeftEllipsisIcon: {
    outline: IconOutline.ChatBubbleLeftEllipsisIcon,
    solid: IconSolid.ChatBubbleLeftEllipsisIcon,
  },
  ChatBubbleLeftRightIcon: {
    outline: IconOutline.ChatBubbleLeftRightIcon,
    solid: IconSolid.ChatBubbleLeftRightIcon,
  },
  ChatBubbleLeftIcon: {
    outline: IconOutline.ChatBubbleLeftIcon,
    solid: IconSolid.ChatBubbleLeftIcon,
  },
  ChatBubbleOvalLeftEllipsisIcon: {
    outline: IconOutline.ChatBubbleOvalLeftEllipsisIcon,
    solid: IconSolid.ChatBubbleOvalLeftEllipsisIcon,
  },
  ChatBubbleOvalLeftIcon: {
    outline: IconOutline.ChatBubbleOvalLeftIcon,
    solid: IconSolid.ChatBubbleOvalLeftIcon,
  },
  CheckBadgeIcon: {
    outline: IconOutline.CheckBadgeIcon,
    solid: IconSolid.CheckBadgeIcon,
  },
  CheckCircleIcon: {
    outline: IconOutline.CheckCircleIcon,
    solid: IconSolid.CheckCircleIcon,
  },
  CheckIcon: { outline: IconOutline.CheckIcon, solid: IconSolid.CheckIcon },

  ChevronDoubleDownIcon: {
    outline: IconOutline.ChevronDoubleDownIcon,
    solid: IconSolid.ChevronDoubleDownIcon,
  },
  ChevronDoubleLeftIcon: {
    outline: IconOutline.ChevronDoubleLeftIcon,
    solid: IconSolid.ChevronDoubleLeftIcon,
  },
  ChevronDoubleRightIcon: {
    outline: IconOutline.ChevronDoubleRightIcon,
    solid: IconSolid.ChevronDoubleRightIcon,
  },
  ChevronDoubleUpIcon: {
    outline: IconOutline.ChevronDoubleUpIcon,
    solid: IconSolid.ChevronDoubleUpIcon,
  },
  ChevronDownIcon: {
    outline: IconOutline.ChevronDownIcon,
    solid: IconSolid.ChevronDownIcon,
  },
  ChevronLeftIcon: {
    outline: IconOutline.ChevronLeftIcon,
    solid: IconSolid.ChevronLeftIcon,
  },
  ChevronRightIcon: {
    outline: IconOutline.ChevronRightIcon,
    solid: IconSolid.ChevronRightIcon,
  },
  ChevronUpDownIcon: {
    outline: IconOutline.ChevronUpDownIcon,
    solid: IconSolid.ChevronUpDownIcon,
  },
  ChevronUpIcon: {
    outline: IconOutline.ChevronUpIcon,
    solid: IconSolid.ChevronUpIcon,
  },
  CircleStackIcon: {
    outline: IconOutline.CircleStackIcon,
    solid: IconSolid.CircleStackIcon,
  },
  ClipboardDocumentCheckIcon: {
    outline: IconOutline.ClipboardDocumentCheckIcon,
    solid: IconSolid.ClipboardDocumentCheckIcon,
  },
  ClipboardDocumentListIcon: {
    outline: IconOutline.ClipboardDocumentListIcon,
    solid: IconSolid.ClipboardDocumentListIcon,
  },
  ClipboardDocumentIcon: {
    outline: IconOutline.ClipboardDocumentIcon,
    solid: IconSolid.ClipboardDocumentIcon,
  },
  ClipboardIcon: {
    outline: IconOutline.ClipboardIcon,
    solid: IconSolid.ClipboardIcon,
  },
  ClockIcon: { outline: IconOutline.ClockIcon, solid: IconSolid.ClockIcon },

  CloudArrowDownIcon: {
    outline: IconOutline.CloudArrowDownIcon,
    solid: IconSolid.CloudArrowDownIcon,
  },
  CloudArrowUpIcon: {
    outline: IconOutline.CloudArrowUpIcon,
    solid: IconSolid.CloudArrowUpIcon,
  },
  CloudIcon: { outline: IconOutline.CloudIcon, solid: IconSolid.CloudIcon },

  CodeBracketSquareIcon: {
    outline: IconOutline.CodeBracketSquareIcon,
    solid: IconSolid.CodeBracketSquareIcon,
  },
  CodeBracketIcon: {
    outline: IconOutline.CodeBracketIcon,
    solid: IconSolid.CodeBracketIcon,
  },
  Cog6ToothIcon: {
    outline: IconOutline.Cog6ToothIcon,
    solid: IconSolid.Cog6ToothIcon,
  },
  Cog8ToothIcon: {
    outline: IconOutline.Cog8ToothIcon,
    solid: IconSolid.Cog8ToothIcon,
  },
  CogIcon: { outline: IconOutline.CogIcon, solid: IconSolid.CogIcon },

  CommandLineIcon: {
    outline: IconOutline.CommandLineIcon,
    solid: IconSolid.CommandLineIcon,
  },
  ComputerDesktopIcon: {
    outline: IconOutline.ComputerDesktopIcon,
    solid: IconSolid.ComputerDesktopIcon,
  },
  CpuChipIcon: {
    outline: IconOutline.CpuChipIcon,
    solid: IconSolid.CpuChipIcon,
  },
  CreditCardIcon: {
    outline: IconOutline.CreditCardIcon,
    solid: IconSolid.CreditCardIcon,
  },
  CubeTransparentIcon: {
    outline: IconOutline.CubeTransparentIcon,
    solid: IconSolid.CubeTransparentIcon,
  },
  CubeIcon: { outline: IconOutline.CubeIcon, solid: IconSolid.CubeIcon },

  CurrencyBangladeshiIcon: {
    outline: IconOutline.CurrencyBangladeshiIcon,
    solid: IconSolid.CurrencyBangladeshiIcon,
  },
  CurrencyDollarIcon: {
    outline: IconOutline.CurrencyDollarIcon,
    solid: IconSolid.CurrencyDollarIcon,
  },
  CurrencyEuroIcon: {
    outline: IconOutline.CurrencyEuroIcon,
    solid: IconSolid.CurrencyEuroIcon,
  },
  CurrencyPoundIcon: {
    outline: IconOutline.CurrencyPoundIcon,
    solid: IconSolid.CurrencyPoundIcon,
  },
  CurrencyRupeeIcon: {
    outline: IconOutline.CurrencyRupeeIcon,
    solid: IconSolid.CurrencyRupeeIcon,
  },
  CurrencyYenIcon: {
    outline: IconOutline.CurrencyYenIcon,
    solid: IconSolid.CurrencyYenIcon,
  },
  CursorArrowRaysIcon: {
    outline: IconOutline.CursorArrowRaysIcon,
    solid: IconSolid.CursorArrowRaysIcon,
  },
  CursorArrowRippleIcon: {
    outline: IconOutline.CursorArrowRippleIcon,
    solid: IconSolid.CursorArrowRippleIcon,
  },
  DevicePhoneMobileIcon: {
    outline: IconOutline.DevicePhoneMobileIcon,
    solid: IconSolid.DevicePhoneMobileIcon,
  },
  DeviceTabletIcon: {
    outline: IconOutline.DeviceTabletIcon,
    solid: IconSolid.DeviceTabletIcon,
  },
  DocumentArrowDownIcon: {
    outline: IconOutline.DocumentArrowDownIcon,
    solid: IconSolid.DocumentArrowDownIcon,
  },
  DocumentArrowUpIcon: {
    outline: IconOutline.DocumentArrowUpIcon,
    solid: IconSolid.DocumentArrowUpIcon,
  },
  DocumentChartBarIcon: {
    outline: IconOutline.DocumentChartBarIcon,
    solid: IconSolid.DocumentChartBarIcon,
  },
  DocumentCheckIcon: {
    outline: IconOutline.DocumentCheckIcon,
    solid: IconSolid.DocumentCheckIcon,
  },
  DocumentDuplicateIcon: {
    outline: IconOutline.DocumentDuplicateIcon,
    solid: IconSolid.DocumentDuplicateIcon,
  },
  DocumentMagnifyingGlassIcon: {
    outline: IconOutline.DocumentMagnifyingGlassIcon,
    solid: IconSolid.DocumentMagnifyingGlassIcon,
  },
  DocumentMinusIcon: {
    outline: IconOutline.DocumentMinusIcon,
    solid: IconSolid.DocumentMinusIcon,
  },
  DocumentPlusIcon: {
    outline: IconOutline.DocumentPlusIcon,
    solid: IconSolid.DocumentPlusIcon,
  },
  DocumentTextIcon: {
    outline: IconOutline.DocumentTextIcon,
    solid: IconSolid.DocumentTextIcon,
  },
  DocumentIcon: {
    outline: IconOutline.DocumentIcon,
    solid: IconSolid.DocumentIcon,
  },
  EllipsisHorizontalCircleIcon: {
    outline: IconOutline.EllipsisHorizontalCircleIcon,
    solid: IconSolid.EllipsisHorizontalCircleIcon,
  },
  EllipsisHorizontalIcon: {
    outline: IconOutline.EllipsisHorizontalIcon,
    solid: IconSolid.EllipsisHorizontalIcon,
  },
  EllipsisVerticalIcon: {
    outline: IconOutline.EllipsisVerticalIcon,
    solid: IconSolid.EllipsisVerticalIcon,
  },
  EnvelopeOpenIcon: {
    outline: IconOutline.EnvelopeOpenIcon,
    solid: IconSolid.EnvelopeOpenIcon,
  },
  EnvelopeIcon: {
    outline: IconOutline.EnvelopeIcon,
    solid: IconSolid.EnvelopeIcon,
  },
  ExclamationCircleIcon: {
    outline: IconOutline.ExclamationCircleIcon,
    solid: IconSolid.ExclamationCircleIcon,
  },
  ExclamationTriangleIcon: {
    outline: IconOutline.ExclamationTriangleIcon,
    solid: IconSolid.ExclamationTriangleIcon,
  },
  EyeDropperIcon: {
    outline: IconOutline.EyeDropperIcon,
    solid: IconSolid.EyeDropperIcon,
  },
  EyeSlashIcon: {
    outline: IconOutline.EyeSlashIcon,
    solid: IconSolid.EyeSlashIcon,
  },
  EyeIcon: { outline: IconOutline.EyeIcon, solid: IconSolid.EyeIcon },

  FaceFrownIcon: {
    outline: IconOutline.FaceFrownIcon,
    solid: IconSolid.FaceFrownIcon,
  },
  FaceSmileIcon: {
    outline: IconOutline.FaceSmileIcon,
    solid: IconSolid.FaceSmileIcon,
  },
  FilmIcon: { outline: IconOutline.FilmIcon, solid: IconSolid.FilmIcon },

  FingerPrintIcon: {
    outline: IconOutline.FingerPrintIcon,
    solid: IconSolid.FingerPrintIcon,
  },
  FireIcon: { outline: IconOutline.FireIcon, solid: IconSolid.FireIcon },
  FlagIcon: { outline: IconOutline.FlagIcon, solid: IconSolid.FlagIcon },

  FolderArrowDownIcon: {
    outline: IconOutline.FolderArrowDownIcon,
    solid: IconSolid.FolderArrowDownIcon,
  },
  FolderMinusIcon: {
    outline: IconOutline.FolderMinusIcon,
    solid: IconSolid.FolderMinusIcon,
  },
  FolderOpenIcon: {
    outline: IconOutline.FolderOpenIcon,
    solid: IconSolid.FolderOpenIcon,
  },
  FolderPlusIcon: {
    outline: IconOutline.FolderPlusIcon,
    solid: IconSolid.FolderPlusIcon,
  },
  FolderIcon: {
    outline: IconOutline.FolderIcon,
    solid: IconSolid.FolderIcon,
  },
  ForwardIcon: {
    outline: IconOutline.ForwardIcon,
    solid: IconSolid.ForwardIcon,
  },
  FunnelIcon: {
    outline: IconOutline.FunnelIcon,
    solid: IconSolid.FunnelIcon,
  },
  GifIcon: { outline: IconOutline.GifIcon, solid: IconSolid.GifIcon },

  GiftTopIcon: {
    outline: IconOutline.GiftTopIcon,
    solid: IconSolid.GiftTopIcon,
  },
  GiftIcon: { outline: IconOutline.GiftIcon, solid: IconSolid.GiftIcon },

  GlobeAltIcon: {
    outline: IconOutline.GlobeAltIcon,
    solid: IconSolid.GlobeAltIcon,
  },
  GlobeAmericasIcon: {
    outline: IconOutline.GlobeAmericasIcon,
    solid: IconSolid.GlobeAmericasIcon,
  },
  GlobeAsiaAustraliaIcon: {
    outline: IconOutline.GlobeAsiaAustraliaIcon,
    solid: IconSolid.GlobeAsiaAustraliaIcon,
  },
  GlobeEuropeAfricaIcon: {
    outline: IconOutline.GlobeEuropeAfricaIcon,
    solid: IconSolid.GlobeEuropeAfricaIcon,
  },
  HandRaisedIcon: {
    outline: IconOutline.HandRaisedIcon,
    solid: IconSolid.HandRaisedIcon,
  },
  HandThumbDownIcon: {
    outline: IconOutline.HandThumbDownIcon,
    solid: IconSolid.HandThumbDownIcon,
  },
  HandThumbUpIcon: {
    outline: IconOutline.HandThumbUpIcon,
    solid: IconSolid.HandThumbUpIcon,
  },
  HashtagIcon: {
    outline: IconOutline.HashtagIcon,
    solid: IconSolid.HashtagIcon,
  },
  HeartIcon: { outline: IconOutline.HeartIcon, solid: IconSolid.HeartIcon },

  HomeModernIcon: {
    outline: IconOutline.HomeModernIcon,
    solid: IconSolid.HomeModernIcon,
  },
  HomeIcon: { outline: IconOutline.HomeIcon, solid: IconSolid.HomeIcon },

  IdentificationIcon: {
    outline: IconOutline.IdentificationIcon,
    solid: IconSolid.IdentificationIcon,
  },
  InboxArrowDownIcon: {
    outline: IconOutline.InboxArrowDownIcon,
    solid: IconSolid.InboxArrowDownIcon,
  },
  InboxStackIcon: {
    outline: IconOutline.InboxStackIcon,
    solid: IconSolid.InboxStackIcon,
  },
  InboxIcon: { outline: IconOutline.InboxIcon, solid: IconSolid.InboxIcon },

  InformationCircleIcon: {
    outline: IconOutline.InformationCircleIcon,
    solid: IconSolid.InformationCircleIcon,
  },
  KeyIcon: { outline: IconOutline.KeyIcon, solid: IconSolid.KeyIcon },

  LanguageIcon: {
    outline: IconOutline.LanguageIcon,
    solid: IconSolid.LanguageIcon,
  },
  LifebuoyIcon: {
    outline: IconOutline.LifebuoyIcon,
    solid: IconSolid.LifebuoyIcon,
  },
  LightBulbIcon: {
    outline: IconOutline.LightBulbIcon,
    solid: IconSolid.LightBulbIcon,
  },
  LinkIcon: { outline: IconOutline.LinkIcon, solid: IconSolid.LinkIcon },

  ListBulletIcon: {
    outline: IconOutline.ListBulletIcon,
    solid: IconSolid.ListBulletIcon,
  },
  LockClosedIcon: {
    outline: IconOutline.LockClosedIcon,
    solid: IconSolid.LockClosedIcon,
  },
  LockOpenIcon: {
    outline: IconOutline.LockOpenIcon,
    solid: IconSolid.LockOpenIcon,
  },
  MagnifyingGlassCircleIcon: {
    outline: IconOutline.MagnifyingGlassCircleIcon,
    solid: IconSolid.MagnifyingGlassCircleIcon,
  },
  MagnifyingGlassMinusIcon: {
    outline: IconOutline.MagnifyingGlassMinusIcon,
    solid: IconSolid.MagnifyingGlassMinusIcon,
  },
  MagnifyingGlassPlusIcon: {
    outline: IconOutline.MagnifyingGlassPlusIcon,
    solid: IconSolid.MagnifyingGlassPlusIcon,
  },
  MagnifyingGlassIcon: {
    outline: IconOutline.MagnifyingGlassIcon,
    solid: IconSolid.MagnifyingGlassIcon,
  },
  MapPinIcon: {
    outline: IconOutline.MapPinIcon,
    solid: IconSolid.MapPinIcon,
  },
  MapIcon: { outline: IconOutline.MapIcon, solid: IconSolid.MapIcon },

  MegaphoneIcon: {
    outline: IconOutline.MegaphoneIcon,
    solid: IconSolid.MegaphoneIcon,
  },
  MicrophoneIcon: {
    outline: IconOutline.MicrophoneIcon,
    solid: IconSolid.MicrophoneIcon,
  },
  MinusCircleIcon: {
    outline: IconOutline.MinusCircleIcon,
    solid: IconSolid.MinusCircleIcon,
  },
  MinusSmallIcon: {
    outline: IconOutline.MinusSmallIcon,
    solid: IconSolid.MinusSmallIcon,
  },
  MinusIcon: { outline: IconOutline.MinusIcon, solid: IconSolid.MinusIcon },
  MoonIcon: { outline: IconOutline.MoonIcon, solid: IconSolid.MoonIcon },

  MusicalNoteIcon: {
    outline: IconOutline.MusicalNoteIcon,
    solid: IconSolid.MusicalNoteIcon,
  },
  NewspaperIcon: {
    outline: IconOutline.NewspaperIcon,
    solid: IconSolid.NewspaperIcon,
  },
  NoSymbolIcon: {
    outline: IconOutline.NoSymbolIcon,
    solid: IconSolid.NoSymbolIcon,
  },
  PaintBrushIcon: {
    outline: IconOutline.PaintBrushIcon,
    solid: IconSolid.PaintBrushIcon,
  },
  PaperAirplaneIcon: {
    outline: IconOutline.PaperAirplaneIcon,
    solid: IconSolid.PaperAirplaneIcon,
  },
  PaperClipIcon: {
    outline: IconOutline.PaperClipIcon,
    solid: IconSolid.PaperClipIcon,
  },
  PauseCircleIcon: {
    outline: IconOutline.PauseCircleIcon,
    solid: IconSolid.PauseCircleIcon,
  },
  PauseIcon: { outline: IconOutline.PauseIcon, solid: IconSolid.PauseIcon },

  PencilSquareIcon: {
    outline: IconOutline.PencilSquareIcon,
    solid: IconSolid.PencilSquareIcon,
  },
  PencilIcon: {
    outline: IconOutline.PencilIcon,
    solid: IconSolid.PencilIcon,
  },
  PhoneArrowDownLeftIcon: {
    outline: IconOutline.PhoneArrowDownLeftIcon,
    solid: IconSolid.PhoneArrowDownLeftIcon,
  },
  PhoneArrowUpRightIcon: {
    outline: IconOutline.PhoneArrowUpRightIcon,
    solid: IconSolid.PhoneArrowUpRightIcon,
  },
  PhoneXMarkIcon: {
    outline: IconOutline.PhoneXMarkIcon,
    solid: IconSolid.PhoneXMarkIcon,
  },
  PhoneIcon: { outline: IconOutline.PhoneIcon, solid: IconSolid.PhoneIcon },
  PhotoIcon: { outline: IconOutline.PhotoIcon, solid: IconSolid.PhotoIcon },

  PlayCircleIcon: {
    outline: IconOutline.PlayCircleIcon,
    solid: IconSolid.PlayCircleIcon,
  },
  PlayPauseIcon: {
    outline: IconOutline.PlayPauseIcon,
    solid: IconSolid.PlayPauseIcon,
  },
  PlayIcon: { outline: IconOutline.PlayIcon, solid: IconSolid.PlayIcon },

  PlusCircleIcon: {
    outline: IconOutline.PlusCircleIcon,
    solid: IconSolid.PlusCircleIcon,
  },
  PlusSmallIcon: {
    outline: IconOutline.PlusSmallIcon,
    solid: IconSolid.PlusSmallIcon,
  },
  PlusIcon: { outline: IconOutline.PlusIcon, solid: IconSolid.PlusIcon },
  PowerIcon: { outline: IconOutline.PowerIcon, solid: IconSolid.PowerIcon },

  PresentationChartBarIcon: {
    outline: IconOutline.PresentationChartBarIcon,
    solid: IconSolid.PresentationChartBarIcon,
  },
  PresentationChartLineIcon: {
    outline: IconOutline.PresentationChartLineIcon,
    solid: IconSolid.PresentationChartLineIcon,
  },
  PrinterIcon: {
    outline: IconOutline.PrinterIcon,
    solid: IconSolid.PrinterIcon,
  },
  PuzzlePieceIcon: {
    outline: IconOutline.PuzzlePieceIcon,
    solid: IconSolid.PuzzlePieceIcon,
  },
  QrCodeIcon: {
    outline: IconOutline.QrCodeIcon,
    solid: IconSolid.QrCodeIcon,
  },
  QuestionMarkCircleIcon: {
    outline: IconOutline.QuestionMarkCircleIcon,
    solid: IconSolid.QuestionMarkCircleIcon,
  },
  QueueListIcon: {
    outline: IconOutline.QueueListIcon,
    solid: IconSolid.QueueListIcon,
  },
  RadioIcon: { outline: IconOutline.RadioIcon, solid: IconSolid.RadioIcon },

  ReceiptPercentIcon: {
    outline: IconOutline.ReceiptPercentIcon,
    solid: IconSolid.ReceiptPercentIcon,
  },
  ReceiptRefundIcon: {
    outline: IconOutline.ReceiptRefundIcon,
    solid: IconSolid.ReceiptRefundIcon,
  },
  RectangleGroupIcon: {
    outline: IconOutline.RectangleGroupIcon,
    solid: IconSolid.RectangleGroupIcon,
  },
  RectangleStackIcon: {
    outline: IconOutline.RectangleStackIcon,
    solid: IconSolid.RectangleStackIcon,
  },
  RocketLaunchIcon: {
    outline: IconOutline.RocketLaunchIcon,
    solid: IconSolid.RocketLaunchIcon,
  },
  RssIcon: { outline: IconOutline.RssIcon, solid: IconSolid.RssIcon },
  ScaleIcon: { outline: IconOutline.ScaleIcon, solid: IconSolid.ScaleIcon },

  ScissorsIcon: {
    outline: IconOutline.ScissorsIcon,
    solid: IconSolid.ScissorsIcon,
  },
  ServerStackIcon: {
    outline: IconOutline.ServerStackIcon,
    solid: IconSolid.ServerStackIcon,
  },
  ServerIcon: {
    outline: IconOutline.ServerIcon,
    solid: IconSolid.ServerIcon,
  },
  ShareIcon: { outline: IconOutline.ShareIcon, solid: IconSolid.ShareIcon },

  ShieldCheckIcon: {
    outline: IconOutline.ShieldCheckIcon,
    solid: IconSolid.ShieldCheckIcon,
  },
  ShieldExclamationIcon: {
    outline: IconOutline.ShieldExclamationIcon,
    solid: IconSolid.ShieldExclamationIcon,
  },
  ShoppingBagIcon: {
    outline: IconOutline.ShoppingBagIcon,
    solid: IconSolid.ShoppingBagIcon,
  },
  ShoppingCartIcon: {
    outline: IconOutline.ShoppingCartIcon,
    solid: IconSolid.ShoppingCartIcon,
  },
  SignalSlashIcon: {
    outline: IconOutline.SignalSlashIcon,
    solid: IconSolid.SignalSlashIcon,
  },
  SignalIcon: {
    outline: IconOutline.SignalIcon,
    solid: IconSolid.SignalIcon,
  },
  SparklesIcon: {
    outline: IconOutline.SparklesIcon,
    solid: IconSolid.SparklesIcon,
  },
  SpeakerWaveIcon: {
    outline: IconOutline.SpeakerWaveIcon,
    solid: IconSolid.SpeakerWaveIcon,
  },
  SpeakerXMarkIcon: {
    outline: IconOutline.SpeakerXMarkIcon,
    solid: IconSolid.SpeakerXMarkIcon,
  },
  Square2StackIcon: {
    outline: IconOutline.Square2StackIcon,
    solid: IconSolid.Square2StackIcon,
  },
  Square3Stack3DIcon: {
    outline: IconOutline.Square3Stack3DIcon,
    solid: IconSolid.Square3Stack3DIcon,
  },
  Squares2X2Icon: {
    outline: IconOutline.Squares2X2Icon,
    solid: IconSolid.Squares2X2Icon,
  },
  SquaresPlusIcon: {
    outline: IconOutline.SquaresPlusIcon,
    solid: IconSolid.SquaresPlusIcon,
  },
  StarIcon: { outline: IconOutline.StarIcon, solid: IconSolid.StarIcon },

  StopCircleIcon: {
    outline: IconOutline.StopCircleIcon,
    solid: IconSolid.StopCircleIcon,
  },
  StopIcon: { outline: IconOutline.StopIcon, solid: IconSolid.StopIcon },
  SunIcon: { outline: IconOutline.SunIcon, solid: IconSolid.SunIcon },

  SwatchIcon: {
    outline: IconOutline.SwatchIcon,
    solid: IconSolid.SwatchIcon,
  },
  TableCellsIcon: {
    outline: IconOutline.TableCellsIcon,
    solid: IconSolid.TableCellsIcon,
  },
  TagIcon: { outline: IconOutline.TagIcon, solid: IconSolid.TagIcon },

  TicketIcon: {
    outline: IconOutline.TicketIcon,
    solid: IconSolid.TicketIcon,
  },
  TrashIcon: { outline: IconOutline.TrashIcon, solid: IconSolid.TrashIcon },

  TrophyIcon: {
    outline: IconOutline.TrophyIcon,
    solid: IconSolid.TrophyIcon,
  },
  TruckIcon: { outline: IconOutline.TruckIcon, solid: IconSolid.TruckIcon },
  TvIcon: { outline: IconOutline.TvIcon, solid: IconSolid.TvIcon },

  UserCircleIcon: {
    outline: IconOutline.UserCircleIcon,
    solid: IconSolid.UserCircleIcon,
  },
  UserGroupIcon: {
    outline: IconOutline.UserGroupIcon,
    solid: IconSolid.UserGroupIcon,
  },
  UserMinusIcon: {
    outline: IconOutline.UserMinusIcon,
    solid: IconSolid.UserMinusIcon,
  },
  UserPlusIcon: {
    outline: IconOutline.UserPlusIcon,
    solid: IconSolid.UserPlusIcon,
  },
  UserIcon: { outline: IconOutline.UserIcon, solid: IconSolid.UserIcon },
  UsersIcon: { outline: IconOutline.UsersIcon, solid: IconSolid.UsersIcon },

  VariableIcon: {
    outline: IconOutline.VariableIcon,
    solid: IconSolid.VariableIcon,
  },
  VideoCameraSlashIcon: {
    outline: IconOutline.VideoCameraSlashIcon,
    solid: IconSolid.VideoCameraSlashIcon,
  },
  VideoCameraIcon: {
    outline: IconOutline.VideoCameraIcon,
    solid: IconSolid.VideoCameraIcon,
  },
  ViewColumnsIcon: {
    outline: IconOutline.ViewColumnsIcon,
    solid: IconSolid.ViewColumnsIcon,
  },
  ViewfinderCircleIcon: {
    outline: IconOutline.ViewfinderCircleIcon,
    solid: IconSolid.ViewfinderCircleIcon,
  },
  WalletIcon: {
    outline: IconOutline.WalletIcon,
    solid: IconSolid.WalletIcon,
  },
  WifiIcon: { outline: IconOutline.WifiIcon, solid: IconSolid.WifiIcon },

  WindowIcon: {
    outline: IconOutline.WindowIcon,
    solid: IconSolid.WindowIcon,
  },
  WrenchScrewdriverIcon: {
    outline: IconOutline.WrenchScrewdriverIcon,
    solid: IconSolid.WrenchScrewdriverIcon,
  },
  WrenchIcon: {
    outline: IconOutline.WrenchIcon,
    solid: IconSolid.WrenchIcon,
  },
  XCircleIcon: {
    outline: IconOutline.XCircleIcon,
    solid: IconSolid.XCircleIcon,
  },
  XMarkIcon: { outline: IconOutline.XMarkIcon, solid: IconSolid.XMarkIcon },
};
