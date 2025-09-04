import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'

type ProductDescriptionProps = {
  text: string | null
}

export function ProductDescription({ text }: ProductDescriptionProps) {
  if (text === null) return null

  return (
    <Accordion
      className="mt-20 border border-gray-200 bg-white p-7"
      type="single"
      collapsible
    >
      <AccordionItem value={text}>
        <AccordionTrigger className="text-base font-medium hover:no-underline md:text-2xl">
          Informações do produto
        </AccordionTrigger>

        <AccordionContent className="mt-7 border-t border-t-gray-200 pt-7 text-sm text-gray-500 md:text-base">
          {text}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
