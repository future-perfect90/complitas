export default function Message({name}: {name?: string}) {
  if (!name) return <div>Hello, world!</div>;
  return <div>Hello, {name}!</div>;
}