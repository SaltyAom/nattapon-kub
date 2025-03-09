import { createSignal, createEffect, on } from 'solid-js'
// @ts-expect-error h is used in build step
import h from 'solid-js/h'

import Image from 'dom-to-image'

// @ts-expect-error
import { model } from './directive'

import DownloadIcon from './icons/download'

function App() {
	const [value, setValue] = createSignal('ตัดต่อ 👎')
	let isLoad = false

	let container: HTMLElement | undefined
	let profile: HTMLImageElement | undefined
	const [image, setImage] = createSignal('')

	function createImage() {
		if (!isLoad || !container) return

		Image.toPng(container, {
			quality: 100,
			width: container.clientWidth * 3,
			height: container.clientHeight * 3,
			style: {
				transform: 'scale(3)',
				transformOrigin: 'top left'
			}
		}).then(setImage)
	}

	createEffect(
		on(value, createImage, {
			defer: true
		})
	)

	return (
		<main class="flex flex-col justify-center items-center gap-7 h-screen px-1 md:px-0">
			{/* <h1 class="text-3xl sm:text-4xl font-medium">ไม่พี่คืองี้</h1> */}

			<section class="relative flex justify-center items-center max-w-3xl w-full min-h-96 border border-gray-300 rounded-2xl overflow-hidden">
				<div
					class={`absolute z-10 flex justify-center items-center w-full h-full bg-white ${image() ? '' : 'hidden'}`}
				>
					<img
						src={image()}
						class="object-contain"
						alt={`Nattapon Kub ${value()}`}
						style={`width:${container?.clientWidth}px; height:${container?.clientHeight}px`}
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
						ref={profile}
						onLoad={() => {
							isLoad = true
							createImage()
						}}
					/>
					<div class="flex flex-col gap-1.5 text-3xl max-w-md md:max-w-xl bg-comment rounded-4xl px-6 py-3 whitespace-pre-wrap transition-all duration-300">
						<h3 class="font-medium">Nattapon Kub</h3>
						<p class="text-ellipsis overflow-hidden leading-10">{value()}</p>
					</div>
				</article>
			</section>

			<form class="flex flex-col sm:flex-row justify-center w-full gap-2">
				<textarea
					class="appearance-none text-lg w-full sm:max-w-xs min-h-26 p-3 bg-gray-100 rounded-xl resize-none outline-none"
					use:model={[value, setValue]}
					autofocus
					autocomplete="off"
					autocapitalize="off"
					name="message"
					title="ใส่ข้อความที่จะให้ธูปพิมพ์"
					aria-label="ใส่ข้อความที่จะให้ธูปพิมพ์"
				/>
				<a
					href={image()}
					tabIndex={1}
					class="flex justify-center items-center gap-3 text-xl min-w-26 min-h-26 p-2 rounded-xl bg-gray-100 interact:bg-blue-100/75 interact:text-blue-500 cursor-pointer transition-colors"
					download={`${value().replace(/\n/g, ' ')}.png`}
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
