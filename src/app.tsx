import { createSignal, createEffect, on, Show } from 'solid-js'

import Image from 'dom-to-image'

// @ts-expect-error
import { model } from './directive'

import DownloadIcon from './icons/download'
import MentionIcon from './icons/mention'

function App() {
	const [value, setValue] = createSignal('ตัดต่อ 👎')
	let isLoad = false

	const [image, setImage] = createSignal('')
	let container: HTMLElement | undefined
	let profile: HTMLImageElement | undefined

	const [showDialog, setShowDialog] = createSignal(false)
	const [mentionPlaceholder, setMentionPlaceholder] = createSignal('')
	const [mention, setMention] = createSignal('')

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
		on([value, mention], createImage, {
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
							setTimeout(createImage, 250)
						}}
					/>
					<div class="flex flex-col gap-1 max-w-md md:max-w-xl bg-comment rounded-4xl px-6 py-3 whitespace-pre-wrap transition-all duration-300">
						<h3 class="font-medium text-2xl">Nattapon Kub</h3>
						<p class="text-3xl text-ellipsis overflow-hidden leading-10">
							<Show when={mention()}>
								<span class="text-blue-500">
									{mention()}{' '}
								</span>
							</Show>
							{value()}{' '}
						</p>
					</div>
				</article>
			</section>

			<Show when={showDialog()}>
				<dialog class="fixed z-20 top-0 left-0 flex justify-center items-center w-full h-screen bg-black/10">
					<div class="flex flex-col max-w-[16rem] w-full bg-white/80 backdrop-blur rounded-xl overflow-hidden shadow-xl shadow-black/5">
						<input
							class="appearance-none text-lg w-full sm:max-w-xs p-3 bg-transparent rounded-xl resize-none outline-none"
							use:model={[
								mentionPlaceholder,
								setMentionPlaceholder
							]}
							autofocus
							autocomplete="off"
							autocapitalize="off"
							autocorrect="off"
							name="mention"
							title="mention คนอื่น"
							aria-label="mention คนอื่น"
						/>
						<form
							method="dialog"
							class="flex w-full border-t border-gray-300"
						>
							<button
								class="flex flex-1 justify-center items-center py-2 text-blue-500 interact:bg-blue-100/75 transition-colors cursor-pointer border-r border-gray-300"
								type="button"
								onClick={() => {
									setMention(mentionPlaceholder())
									setShowDialog(false)
								}}
							>
								บันทึก
							</button>
							<button
								class="flex flex-1 justify-center items-center py-2 text-gray-500 font-light interact:bg-gray-200/60 transition-colors cursor-pointer"
								type="button"
								onClick={() => {
									setMentionPlaceholder(mention())
									setShowDialog(false)
								}}
							>
								ยกเลิก
							</button>
						</form>
					</div>
				</dialog>
			</Show>

			<form
				id="form"
				class="flex flex-col sm:flex-row justify-center w-full gap-2"
			>
				<button
					tabIndex={1}
					class="flex justify-center items-center gap-3 text-xl min-w-26 min-h-26 p-2 rounded-xl bg-gray-100 interact:bg-blue-100/75 interact:text-blue-500 cursor-pointer transition-colors"
					title="mention คนอื่น"
					aria-label="กดเพื่อ mention คนอื่น"
					type="button"
					onClick={() => {
						setShowDialog(true)
					}}
				>
					<MentionIcon />
				</button>
				<textarea
					class="appearance-none text-lg w-full sm:max-w-xs min-h-26 p-3 bg-gray-100 rounded-xl resize-none outline-none"
					use:model={[value, setValue]}
					autofocus
					autocomplete="off"
					autocapitalize="off"
					name="message"
					title="ใส่ข้อความที่จะให้ธูปพิมพ์"
					aria-label="ใส่ข้อความที่จะให้ธูปพิมพ์"
					style={{
						'grid-area': 'c'
					}}
				/>
				<a
					href={image()}
					tabIndex={1}
					class="flex justify-center items-center gap-3 text-xl min-w-26 min-h-26 p-2 rounded-xl bg-gray-100 interact:bg-blue-100/75 interact:text-blue-500 cursor-pointer transition-colors"
					download={`${value().replace(/\n/g, ' ')}.png`}
					title="โหลดรูปธูป"
					aria-label="กดเพื่อโหลดรูปธูป"
					style={{
						'grid-area': 'b'
					}}
				>
					<DownloadIcon class="transform scale-125" />
				</a>
			</form>
		</main>
	)
}

export default App
