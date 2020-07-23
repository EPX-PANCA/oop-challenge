const array = [1, 2, 3, 4, 5];
const list = array.filter((value) => true);

list.splice(0, 1);

function hello(list) {
  const removeFirstIndex = (value) => list.indexOf(value) != 0;
  return list.filter(removeFirstIndex);
}

console.log(hello(array));
console.log(array);
console.log(list);
console.log(array.some((value) => value % 2 == 0));

(async () => {
  const hello = await Promise.resolve("Hello wordl");
  console.log(hello);
})();