import {
  TrashIcon,
  TruckIcon,
  LeafIcon,
  DropIcon,
  SnowflakeIcon,
  SparkleIcon,
  HomeIcon,
} from "@/components/ui/icons";

export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  waste_removal:       <TrashIcon size={28} />,
  construction_waste:  <TruckIcon size={28} />,
  lawn_care:           <LeafIcon size={28} />,
  septic_pumping:      <DropIcon size={28} />,
  snow_removal:        <SnowflakeIcon size={28} />,
  cleaning:            <SparkleIcon size={28} />,
};

export const ADDON_ICONS: Record<string, React.ReactNode> = {
  lawn_subscription:        <LeafIcon size={24} />,
  cleaning_subscription:    <SparkleIcon size={24} />,
  home_care_subscription:   <HomeIcon size={24} />,
};
