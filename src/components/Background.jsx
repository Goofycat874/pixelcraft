// The fixed sky behind everything: a blue-to-peach gradient with three slow, blurred lights.
export default function Background() {
  return (
    <div aria-hidden="true" className="sky pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="sky-orb sky-a right-[-8vw] top-[-10vh] h-[62vh] w-[48vw] bg-[#7d9dff] opacity-50" />
      <div className="sky-orb sky-b bottom-[-18vh] left-[18vw] h-[48vh] w-[40vw] bg-[#ffb48a] opacity-45" />
      <div className="sky-orb sky-c left-[-12vw] top-[30vh] h-[44vh] w-[34vw] bg-[#a9c0ff] opacity-50" />
    </div>
  );
}
