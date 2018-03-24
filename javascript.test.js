function ClassA(name) {
  this.name = name;
}

function ClassB(age) {
  this.age = age;
}

objA = new ClassA("bob");
objB = new ClassB(15);

obj = Object.assign(objA, objB);

