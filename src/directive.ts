import { createRenderEffect, type createSignal } from 'solid-js'

export function model(
	element: HTMLInputElement,
	accessor: typeof createSignal<string>
) {
	const [value, set] = accessor('')

	element.addEventListener(
		'input',
		(e) => set((e.currentTarget as HTMLInputElement)!.value),
		true
	)

	createRenderEffect(() => (element!.value = value()))
}

type GetDirective<
	T extends (e: any, a: R) => unknown,
	R extends typeof createSignal = typeof createSignal
> = ReturnType<Parameters<T>[1]>

declare module 'solid-js' {
	namespace JSX {
		interface Directives {
			model: GetDirective<typeof model>
		}
	}
}
