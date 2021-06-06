<script>
    export let state;
    export let saveFromState;
    const changeDir = () => {
        let newLinks = [];
        for(let link of state.links){
            if(link.url === state.change_url && state.move_folder !== ""){
                link.collection = state.move_folder;
            }
            newLinks.push(
                link
            );
        }
        state.links = newLinks; //for reload
        saveFromState();
        state.open_modal = false;
    }
</script>
<div
  class="{state.open_modal ? 'flex' : 'hidden'} overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
  id="modal-example-small">
  <div class="relative w-auto my-6 mx-auto max-w-sm">
    <!--content-->
    <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
      <!--header-->
      <div class="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
        <h3 class="text-3xl font-semibold">
          Choose Directory
        </h3>
      </div>
      <!--body-->
      <div class="relative p-6 flex-auto h-[380px] overflow-y-scroll">
        {#each state.dirs as dir}
            <button class="py-1 px-4 w-full {state.move_folder === dir ? 'bg-gray-400' : "hover:bg-gray-400"}" >
                <div class="text-lg text-left" on:click={()=>state.move_folder = dir}>📁 {dir}</div>
            </button>
        {/each}
      </div>
      <!--footer-->
      <div class="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
        <button
          class="text-purple-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button" on:click={()=>{state.move_folder = "";state.open_modal=false;}}>
          Close
        </button>
        <button
          class="bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button" on:click={()=>{state.open_modal=true;changeDir()}}>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

<div class="{state.open_modal ? 'flex' : 'hidden'} opacity-25 fixed inset-0 z-40 bg-black" id="modal-example-small-backdrop"></div>
