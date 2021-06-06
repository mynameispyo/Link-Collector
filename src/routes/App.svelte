<script>
	import {onMount} from 'svelte';
	import { isInList, debuging} from "../utils/storage";
	import DirSelect from "../components/DirSelect.svelte";
	let state={};
	state.search_input = "";
	state.select_folder = "All";


	state.move_folder = '';
	state.change_url = '';
	state.open_modal = false;

	// debuging();
	onMount(async()=>{
		chrome.storage.sync.get('links', function(result) {
			if(result.links === undefined){
				result.links = [];
				chrome.storage.sync.set({'links':result.links});
			}
			state.links = result.links;
		});
		chrome.storage.sync.get('dirs', function(result) {
			if(result.dirs === undefined){
				result.dirs = ['All'];
				chrome.storage.sync.set({'dirs':result.dirs});
			}
			state.dirs = result.dirs;
		});
		chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
			state.url = tabs[0].url;
			state.title = tabs[0].title;
		});
	})

	const newFolder = () => {
		let name = prompt("New Folder Name");
		if (name !== null && name !== "" && name !== undefined){
			for(let dir of state.dirs){
				if(dir === name){
					alert("Folder already exist");
					return ;
				}
			}
			state.dirs.push(name);
			state.dirs = state.dirs; //for reload
			saveFromState();
		}
	}

	const deleteFolder = (name) => {
		if(window.confirm("Are you sure?")){
			let newDirs = [];
			for(let dir of state.dirs){
				if(dir !== name || dir === 'All'){
					newDirs.push(
						dir
					);
				}
			}
			state.dirs = newDirs;
			
			let newLinks =[];
			for (let link of state.links){
				if (link.collection !== name || link.collection === 'All'){
					newLinks.push(
						link
					)
				}
			}
			state.links = newLinks;
			
			saveFromState();

			state.select_folder = 'All';
		}
	}
 
	const saveLink = () => {
		state.links.push(
			{
				url: state.url,
				title: state.title,
				collection: 'All',
				update: Date.now(),
			}
		)
		state.links = state.links; //for reload
		saveFromState();
	}

	const unsaveLink = () => {
		let newlinks = [];
		for(let link of state.links){
			if(link.url !== state.url){
				newlinks.push(
					link
				);
			}
		}
		state.links = newlinks; //for reload
		saveFromState();
	}

	const simpleISO = (date) => {
		let current_datetime = new Date(date);
		let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate()
		return formatted_date;
	}

	const deleteLink = (url) => {
		if(window.confirm("Are you sure?")){
			let newlinks = [];
			for(let link of state.links){
				if(link.url !== url){
					newlinks.push(
						link
					);
				}
			}
			state.links = newlinks; //for reload
			saveFromState();
		}
	}

	const saveFromState = () => {
		chrome.storage.sync.set({'links':state.links, 'dirs': state.dirs});
	}

	const countBookmarks = () => {
		let c=0;
		for (let link of state.links){
			if(link.title.toUpperCase().indexOf((state.search_input.toUpperCase()) > -1 || link.url.toUpperCase().indexOf(state.search_input.toUpperCase()) > -1) && (state.select_folder === 'All' || state.select_folder === link.collection)){
				c++;
			}
		}
		state.bookmarks_num = c;
	}
</script>

<main class="w-[750px] h-[600px] grid grid-cols-5 gap-0 select-none">
	{#if state.links !== undefined && state.dirs !== undefined}
		<div class="col-start-1 col-span-2 bg-gray-300">
			<div class="w-full h-[48px] px-[20px] py-2 gap-1">
				<p class="text-base" on:click={newFolder}>➕</p>
			</div>
			<div class="overflow-y-auto h-[552px]">
				{#each state.dirs as dir}
					<button class="py-1 px-4 w-full hover:bg-gray-400">
						<div class="text-lg text-left" on:click={()=>{state.select_folder = dir;countBookmarks()}}>📁 {dir}</div>
					</button>
				{/each}
			</div>
		</div>
		<div class="col-start-3 col-span-3">
			<div class="w-full h-[48px] px-[20px] py-2 grid grid-cols-10 gap-1">
				<input class="col-start-1 col-span-7 bg-gray-100 text-base" placeholder="🔎 Search" bind:value={state.search_input}>
				{#if !isInList(state.url,state.links)}
					<button class="col-start-9 col-span-2 bg-blue-500 text-white text-base" on:click={saveLink}>⭐Save</button>
				{:else} 
					<button class="col-start-9 col-span-2 bg-blue-300 text-white text-base" on:click={unsaveLink}>✔️Saved</button>
				{/if}
			</div>
			<div class="w-full h-[48px] px-[20px] border-b-2 border-gray-200">
				<p class="text-xl inline-block align-middle">📁 {state.select_folder}</p>
				<button class="inline-block align-middle ml-2" on:click={deleteFolder(state.select_folder)}><img class="w-5" src="assets/trash.png" alt="del folder"></button>
			</div>
			<div class="overflow-y-auto h-[500px]">
				{#each state.links.reverse() as link}
					{#if (link.title.toUpperCase().indexOf(state.search_input.toUpperCase()) > -1 || link.url.toUpperCase().indexOf(state.search_input.toUpperCase()) > -1) && (state.select_folder === 'All' || state.select_folder === link.collection)}
						<div class="py-1 px-4 select-none grid grid-cols-12">
							<div class="border-b-2 border-gray-200 col-start-1 col-end-12">
								<p class="text-2xl">{link.title.length > 30 ? link.title.slice(0,27) + "..." : link.title}</p>
								<p class="text-lg">{link.url.split("//").slice(1,link.url.split("//").length).join("//").length > 30 ? link.url.split("//").slice(1,link.url.split("//").length).join("//").slice(0,27) + "..." : link.url.split("//").slice(1,link.url.split("//").length).join("//")} * {simpleISO(link.update)}</p>
							</div>
							<div class="border-b-2 border-gray-200 col-start-12 align-middle text-center">
								<button on:click={window.open(link.url, '_blank')}><img class="w-4" src="assets/new-tab.png" alt="open"></button>
								<button on:click={deleteLink(link.url)}><img class="w-4" src="assets/trash.png" alt="del"></button>
								<button on:click={()=>{state.change_url= link.url; state.open_modal=true;}}>📁</button>
							</div>
						</div>
					{/if}
				{/each}
					<div class="text-center py-2">{state.select_folder === 'All' ? state.links.length : state.bookmarks_num } Bookmarks</div>
			</div>
		</div>
		<DirSelect state={state} saveFromState={saveFromState}/>
	{:else}
		<p>Loading...</p>
	{/if}
</main>