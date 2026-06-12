import TemplateStudio from "./TemplateStudio";

interface Props {
  restaurantId: string;
}

export default function TemplatePreview({ restaurantId }: Props) {
  return <TemplateStudio restaurantId={restaurantId} />;
}
