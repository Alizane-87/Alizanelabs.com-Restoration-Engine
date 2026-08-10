import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { proofBlocks } from "@/content/site";

export function ProofProtocol() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {proofBlocks.map((block) => (
        <Card key={block.title} as="li" tone="dark">
          <CardTitle className="text-white">{block.title}</CardTitle>
          <CardBody tone="dark">{block.body}</CardBody>
        </Card>
      ))}
    </ul>
  );
}
