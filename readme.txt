= License
- Need license if release
http://www.pcg-random.org/
http://www.pcg-random.org/using-pcg-c-basic.html
http://man7.org/linux/man-pages/man3/ldexp.3.html

= Refactoring
- convert all _internal UInt functions to take array data and operate on it
- Error/Exceptions where approperiate. one in div
	- inc should not be odd check, console.log(test below in RandomFactory32)


= Upgrades
- Implmenet ArrayBuffer instead of Array for uint representation
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
