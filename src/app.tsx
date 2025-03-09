import { createSignal, createEffect } from 'solid-js'
// @ts-expect-error h is used in build step
import h from 'solid-js/h'

import Image from 'dom-to-image'

// @ts-expect-error
import { model } from './directive'

import DownloadIcon from './icons/download'

function App() {
	const [value, setValue] = createSignal('ตัดต่อ 👎')

	let container: HTMLElement | undefined
	let result: HTMLImageElement | undefined
	let download: HTMLAnchorElement | undefined

	createEffect(() => {
		value()

		if (!container || !result || !download) return

		Image.toSvg(container, {
			quality: 100,
			style: {
				width: container.clientWidth,
				height: container.clientHeight
			}
		}).then((dataUrl) => {
			result.src = dataUrl
			download.href = dataUrl
		})
	})

	return (
		<main class="flex flex-col justify-center items-center gap-7 h-screen px-1 md:px-0">
			{/* <h1 class="text-3xl sm:text-4xl font-medium">ไม่พี่คืองี้</h1> */}

			<section class="relative flex justify-center items-center max-w-3xl w-full min-h-96 border border-gray-300 rounded-2xl overflow-hidden">
				<div class="absolute z-10 flex justify-center items-center w-full h-full bg-white">
					<img
						ref={result}
						class="object-cover"
						alt={`Nattapon Kub ${value()}`}
					/>
				</div>
				<article
					inert
					ref={container}
					class="flex gap-4 bg-white p-3 user-select-none"
				>
					<img
						class="w-16 h-16 rounded-full"
						src="/profile.webp"
						alt="Nattapon Kub"
					/>
					<div class="flex flex-col gap-1.5 text-3xl max-w-md md:max-w-xl bg-comment rounded-3xl px-6 py-3 whitespace-pre-wrap transition-all duration-300">
						<h3 class="font-medium">Nattapon Kub</h3>
						<p class="text-ellipsis overflow-hidden">{value()}</p>
					</div>
				</article>
			</section>

			<form class="flex flex-col sm:flex-row justify-center w-full gap-2">
				<textarea
					class="appearance-none text-lg w-full sm:max-w-xs p-3 bg-gray-100 rounded-xl resize-none outline-none"
					use:model={[value, setValue]}
					autofocus
					autocomplete="off"
					autocapitalize="off"
					name="message"
					title="ใส่ข้อความที่จะให้ธูปพิมพ์"
					aria-label="ใส่ข้อความที่จะให้ธูปพิมพ์"
				/>
				<a
					ref={download}
					tabIndex={1}
					class="flex justify-center items-center gap-3 text-xl min-w-20 min-h-20 p-2 rounded-xl bg-gray-100 interact:bg-blue-100/75 interact:text-blue-500 cursor-pointer transition-colors"
					download
					title="โหลดรูปธูป"
					aria-label="กดเพื่อโหลดรูปธูป"
				>
					<DownloadIcon class="transform scale-125" />
					<span class="block sm:hidden text-gray-600">
						โหลดรูปธูป
					</span>
				</a>
			</form>
		</main>
	)
}

export default App
