/*
 * PCG Random Number Generation for C.
 *
 * Copyright 2014 Melissa O'Neill <oneill@pcg-random.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * For additional information about the PCG random number generation scheme,
 * including its license and other licensing options, visit
 *
 *       http://www.pcg-random.org
 */

/*
 * This code is derived from the canonical C++ PCG implementation, which
 * has many additional features and is preferable if you can use C++ in
 * your project.
 *
 * Repetative C code is derived using C preprocessor metaprogramming
 * techniques.
 */

#include "pcg_variants.h"

/* Multi-step advance functions (jump-ahead, jump-back)
 *
 * The method used here is based on Brown, "Random Number Generation
 * with Arbitrary Stride,", Transactions of the American Nuclear
 * Society (Nov. 1994).  The algorithm is very similar to fast
 * exponentiation.
 *
 * Even though delta is an unsigned integer, we can pass a
 * signed integer to go backwards, it just goes "the long way round".
 */

uint64_t pcg_advance_lcg_64(uint64_t state, uint64_t delta, uint64_t cur_mult,
                            uint64_t cur_plus)
{
    uint64_t acc_mult = 1u;
    uint64_t acc_plus = 0u;
//		printf("1. delta: %lu\n", delta);
    while (delta > 0) {
//				printf("2. while delta > 0: %lu\n", delta);
        if (delta & 1) {
//						printf("3. delta & 1: %lu\n", delta);
            acc_mult *= cur_mult;
//						printf("4. acc_mult: %lu\n", acc_mult);
            acc_plus = acc_plus * cur_mult + cur_plus;
//						printf("5. acc_plus: %lu\n", acc_plus);
        }
        cur_plus = (cur_mult + 1) * cur_plus;
//				printf("6. cur_plus: %lu\n", cur_plus);
        cur_mult *= cur_mult;
//				printf("7. cur_mult: %lu\n", cur_mult);
        delta /= 2;
//				printf("8. delta: %lu\n", delta);
    }
//		printf("9. acc_mult*state: %lu\n", acc_mult*state);
//		printf("10. acc_mult*state+acc_plus: %lu\n", acc_mult*state+acc_plus);
    return acc_mult * state + acc_plus;
}

