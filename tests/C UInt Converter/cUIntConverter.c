#include <stdio.h>
#include <math.h>
#include <stdbool.h>

int main() {
	//uint64_t magic = 6364136223846793005;
	uint64_t magic = 1753877967969059832;
	//uint64_t magic = 109;
	bool result[64];

	uint64_t curV = magic;
	for(int i = 63; i >= 0; i--) {
		uint64_t curBitValue = (uint64_t) powl(2, i);
		bool convertedBit;

		if ( curV >= curBitValue ) {
			curV -= curBitValue;
			convertedBit = true;
		}
		else {
			convertedBit = false;
		}

		result[63-i] = convertedBit;
	}

	//Check conversion
	uint64_t sum = 0;
	for(int i = 0; i < 64; i++) {
		int exp = 63-i;
		bool curBit = result[i];
		if ( curBit ) {
			sum+= powl(2, exp);
		}
	}

	//Print javascript array representation
	printf("Value - %lu\n", magic);

	printf("JS Array Representation\n");
	printf("[");
	for(uint i = 0; i < 64; i++) {
		bool bit = result[i];
		if ( bit ) {
			printf("true");
		}
		else {
			printf("false");
		}

		if ( i < 63 ) {
			printf(", ");
		}
	}		
	printf("]\n");

	printf("Check sum of array: %lu\n", sum);

	printf("Casting Magic to 32Bit: %u", (uint32_t) magic);
}
