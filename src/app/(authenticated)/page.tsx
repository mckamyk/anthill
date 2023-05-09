interface CreateData {
  name: string
  desc: string
}

export default function Home() {
  const createOrg = async (data: FormData) => {
    "use server"
    console.log("Create Org: ", data.get('name'), data.get('desc'))
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="p-2 rounded-lg shadow-lg bg-slate-700">
        <div>Get started by creating an Orginaization</div>

        <div className="">
          <form action={createOrg}>
            <div className="mb-2">
              <label className="text-sm pl-2">Name of Org</label>
              <input className="form-input bg-slate-800 block rounded-md w-full" name="name"></input>
            </div>
            <div className="mb-2">
              <label className="text-sm pl-2">Description of Org</label>
              <input className="form-input bg-slate-800 block rounded-md w-full" name="desc"></input>
            </div>

            <div className="flex justify-center">
              <button className="p-2 bg-sky-600 rounded-md active:bg-sky-800 transition-colors">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
