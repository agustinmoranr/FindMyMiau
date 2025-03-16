import React from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
	question: string;
	answer: string;
	value: string;
}

interface AccordionWrapperProps {
	items: FAQItem[];
}

export function AccordionWrapper({ items }: AccordionWrapperProps) {
	return (
		<Accordion type='single' collapsible className='w-full'>
			{items.map((item) => (
				<AccordionItem key={item.value} value={item.value}>
					<AccordionTrigger>{item.question}</AccordionTrigger>
					<AccordionContent>{item.answer}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
