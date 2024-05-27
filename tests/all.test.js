const addTwo = (a, b) => {
    return a + b;
} 

test('ync test', () => {
    expect(addTwo(1, 1)).toBe(2);
}, 70000);