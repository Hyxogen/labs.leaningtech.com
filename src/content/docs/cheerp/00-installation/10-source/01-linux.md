---
title: How to build Cheerp on Linux
---

Cheerp is composed of multiple components, they are somewhat interdependent and should be built together.
The build instructions are provided for the stable release, Cheerp 3.0, or for the latest / development branch.

[Scroll to bottom](#build-latest-version) for the instruction for the latest version, or keep reading to build stable.

## Prerequisites

We assume that you have git, cmake, python and a modern C++ compiler properly installed.
Example, using apt-get:

```bash
apt-get install cmake python3 python3-distutils ninja-build gcc lld git
```

## Build stable version, Cheerp 3.0

### Get the sources, stable version

You need to get all the sources first. Please define the `CHEERP_DEST` environment variable that will be used in various commands.

```bash
mkdir cheerp
cd cheerp
export CHEERP_DEST=/opt/cheerp
git clone --branch cheerp-3.0 https://github.com/leaningtech/cheerp-compiler
git clone --branch cheerp-3.0 https://github.com/leaningtech/cheerp-utils
git clone --branch cheerp-3.0 https://github.com/leaningtech/cheerp-musl
git clone --branch cheerp-3.0 https://github.com/leaningtech/cheerp-libs
```

### Build Cheerp/1: compiler, stable version

```bash
cd cheerp-compiler
cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S llvm -B build -C llvm/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS=clang -G Ninja
ninja -C build -j4
ninja -C build install
cd ..
```

By default Cheerp will be installed in `/opt/cheerp`, with the main executable at `/opt/cheerp/bin/clang++`.
If you need write privileges to `/opt/cheerp`, then prepend all install commands with `sudo`.

### Build Cheerp/2: utilities and libraries, stable version

```bash
cd cheerp-utils
cmake -B build -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} .
make -C build install
cd ..

cd cheerp-musl
mkdir build_genericjs
cd build_genericjs
RANLIB="${CHEERP_DEST}/bin/llvm-ar s" AR="${CHEERP_DEST}/bin/llvm-ar"  CC="${CHEERP_DEST}/bin/clang -target cheerp -I LD="${CHEERP_DEST}/bin/llvm-link" CFLAGS="-Wno-int-conversion" ../configure --target=cheerp --disable-shared --prefix=${CHEERP_DEST} --with-malloc=dlmalloc
make clean
make -j8
make install
cd ..
mkdir build_asmjs
cd build_asmjs
RANLIB="${CHEERP_DEST}/bin/llvm-ar s" AR="${CHEERP_DEST}/bin/llvm-ar"  CC="${CHEERP_DEST}/bin/clang -target cheerp-wasm LD="${CHEERP_DEST}/bin/llvm-link" CFLAGS="-Wno-int-conversion" ../configure --target=cheerp-wasm --disable-shared --prefix=${CHEERP_DEST} --with-malloc=dlmalloc
make clean
make -j8
make install
cd ../..

cd cheerp-compiler
cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S runtimes -B build_runtimes_genericjs -GNinja -C runtimes/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE="${CHEERP_DEST}/share/cmake/Modules/CheerpToolchain.cmake"
ninja -C build_runtimes_genericjs

cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S runtimes -B build_runtimes_wasm -GNinja -C runtimes/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE="${CHEERP_DEST}/share/cmake/Modules/CheerpWasmToolchain.cmake"
ninja -C build_runtimes_wasm

ninja -C build_runtimes_genericjs install
ninja -C build_runtimes_wasm install
cd ..

cd cheerp-libs
make -C webgles install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
make -C wasm install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
make -C stdlibs install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
cd system
cmake -B build_genericjs -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -DCMAKE_TOOLCHAIN_FILE=${CHEERP_DEST}/share/cmake/Modules/CheerpToolchain.cmake .
cmake --build build_genericjs
cmake --install build_genericjs
cmake -B build_asmjs -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -DCMAKE_TOOLCHAIN_FILE=${CHEERP_DEST}/share/cmake/Modules/CheerpWasmToolchain.cmake .
cmake --build build_asmjs
cmake --install build_asmjs
cd ../..
```

## Build latest version

This allows to benefit from the latest develpments and bug fixes, but we reserve the possibility of forward-incompatible changes.

### Get the sources, latest version

You need to get all the sources first. Please define the `CHEERP_DEST` environment variable that will be used in various commands.

```bash
mkdir cheerp
cd cheerp
export CHEERP_DEST=/opt/cheerp
git clone https://github.com/leaningtech/cheerp-compiler
git clone https://github.com/leaningtech/cheerp-utils
git clone https://github.com/leaningtech/cheerp-musl
git clone https://github.com/leaningtech/cheerp-libs
```

### Build Cheerp/1: compiler, latest version

```bash
cd cheerp-compiler
cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S llvm -B build -C llvm/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS=clang -G Ninja
ninja -C build -j4
ninja -C build install
cd ..
```

By default Cheerp will be installed in `/opt/cheerp`, with the main executable at `/opt/cheerp/bin/clang++`.
If you need write privileges to `/opt/cheerp`, then prepend all install commands with `sudo`.

### Build Cheerp/2: utilities and libraries, latest version

```bash
cd cheerp-utils
cmake -B build -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} .
make -C build install
cd ..

cd cheerp-musl
mkdir build_genericjs
cd build_genericjs
RANLIB="${CHEERP_DEST}/bin/llvm-ar s" AR="${CHEERP_DEST}/bin/llvm-ar"  CC="${CHEERP_DEST}/bin/clang -target cheerp LD="${CHEERP_DEST}/bin/llvm-link" CFLAGS="-Wno-int-conversion" ../configure --target=cheerp --disable-shared --prefix=${CHEERP_DEST} --with-malloc=dlmalloc
make clean
make -j8
make install
cd ..
mkdir build_asmjs
cd build_asmjs
RANLIB="${CHEERP_DEST}/bin/llvm-ar s" AR="${CHEERP_DEST}/bin/llvm-ar"  CC="${CHEERP_DEST}/bin/clang -target cheerp-wasm LD="${CHEERP_DEST}/bin/llvm-link" CFLAGS="-Wno-int-conversion" ../configure --target=cheerp-wasm --disable-shared --prefix=${CHEERP_DEST} --with-malloc=dlmalloc
make clean
make -j8
make install
cd ../..

cd cheerp-compiler
cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S runtimes -B build_runtimes_genericjs -GNinja -C runtimes/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE="${CHEERP_DEST}/share/cmake/Modules/CheerpToolchain.cmake"
ninja -C build_runtimes_genericjs

cmake -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -S runtimes -B build_runtimes_wasm -GNinja -C runtimes/CheerpCmakeConf.cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE="${CHEERP_DEST}/share/cmake/Modules/CheerpWasmToolchain.cmake"
ninja -C build_runtimes_wasm

ninja -C build_runtimes_genericjs install
ninja -C build_runtimes_wasm install
cd ..

cd cheerp-libs
make -C webgles install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
make -C wasm install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
make -C stdlibs install INSTALL_PREFIX=${CHEERP_DEST} CHEERP_PREFIX=${CHEERP_DEST}
cd system
cmake -B build_genericjs -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -DCMAKE_TOOLCHAIN_FILE=${CHEERP_DEST}/share/cmake/Modules/CheerpToolchain.cmake .
cmake --build build_genericjs
cmake --install build_genericjs
cmake -B build_asmjs -DCMAKE_INSTALL_PREFIX=${CHEERP_DEST} -DCMAKE_TOOLCHAIN_FILE=${CHEERP_DEST}/share/cmake/Modules/CheerpWasmToolchain.cmake .
cmake --build build_asmjs
cmake --install build_asmjs
cd ../..
```

## "Hello, World" in Cheerp

```cpp
//save as example.cpp
#include <iostream>

int main()
{
    std::cout << "Hello, World!\n";
    return 0;
}
```

`/opt/cheerp/bin/clang++ example.cpp -o cheerp_example.js -O3 && node cheerp_example.js`
Should compile and execute the relevant file.

## Cheerp unit tests

```bash
cd cheerp-utils/tests
python run-tests.py /opt/cheerp/bin/clang++ node --all -j8
```

This command will compile and execute the Cheerp test suite.
