
# Define the compiler/tools prefix
GCC_PREFIX = arm-none-eabi-

# Define tools
CC = $(GCC_PREFIX)gcc
CPP = $(GCC_PREFIX)g++
AR = $(GCC_PREFIX)ar
OBJCOPY = $(GCC_PREFIX)objcopy
SIZE = $(GCC_PREFIX)size

RM = rm -f
MKDIR = mkdir -p

# Recursive wildcard function
rwildcard = $(wildcard $1$2) $(foreach d,$(wildcard $1*),$(call rwildcard,$d/,$2))

# Define the build path, this is where all of the dependancies and
# object files will be placed.
# Note: Currently set to <project>/build/obj directory and set relative to
# the dir which makefile is invoked. If the makefile is moved to the project
# root, BUILD_PATH = build can be used to store the build products in 
# the build directory.
BUILD_PATH = obj

# Path to the root of source files, in this case root of the project to
# inclue ../src and ../lib dirs.
# Note: Consider relocating source files in lib to src, or build a
#       seperate library.
SRC_PATH = ..

# Target this makefile is building.
TARGET = core-tinker

# Find all build.mk makefiles in each source directory in the src tree.
SRC_MAKEFILES := $(call rwildcard,$(SRC_PATH)/,build.mk)

# Include all build.mk defines source files.
include $(SRC_PATH)/src/app_tinker.mk
include $(SRC_MAKEFILES)

# Paths to dependant projects, referenced from root of this project
LIB_CORE_COMMON_PATH = ../core-common-lib
LIB_CORE_COMMUNICATION_PATH = ../core-communication-lib

# Additional include directories, applied to objects built for this target.
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/CMSIS/Include
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/CMSIS/Device/ST/STM32F10x/Include
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/STM32F10x_StdPeriph_Driver/inc
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/STM32_USB-FS-Device_Driver/inc
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/CC3000_Host_Driver
INCLUDE_DIRS += $(LIB_CORE_COMMON_PATH)/SPARK_Firmware_Driver/inc
INCLUDE_DIRS += $(LIB_CORE_COMMUNICATION_PATH)/lib/tropicssl/include
INCLUDE_DIRS += $(LIB_CORE_COMMUNICATION_PATH)/src

# Compiler flags
CFLAGS =  -g3 -gdwarf-2 -Os -mcpu=cortex-m3 -mthumb 
CFLAGS += $(patsubst %,-I$(SRC_PATH)/%,$(INCLUDE_DIRS)) -I.
CFLAGS += -ffunction-sections -Wall -fmessage-length=0

# Generate dependancy files automatically.
CFLAGS += -MD -MP -MF $@.d

# Target specific defines
CFLAGS += -DUSE_STDPERIPH_DRIVER
CFLAGS += -DSTM32F10X_MD
CFLAGS += -DDFU_BUILD_ENABLE

# C++ specific flags
CPPFLAGS = -fno-exceptions -fno-rtti 

# Linker flags
LDFLAGS += -T../linker/linker_stm32f10x_md_dfu.ld -nostartfiles -Xlinker --gc-sections 
LDFLAGS += -L$(SRC_PATH)/$(LIB_CORE_COMMON_PATH)/build -lcore-common-lib
LDFLAGS += -L$(SRC_PATH)/$(LIB_CORE_COMMUNICATION_PATH)/build -lcore-communication-lib
LDFLAGS += -Wl,-Map,$(TARGET).map

# Assember flags
ASFLAGS =  -g3 -gdwarf-2 -mcpu=cortex-m3 -mthumb 
ASFLAGS += -x assembler-with-cpp -fmessage-length=0

# Collect all object and dep files
ALLOBJ += $(addprefix $(BUILD_PATH)/, $(CSRC:.c=.o))
ALLOBJ += $(addprefix $(BUILD_PATH)/, $(CPPSRC:.cpp=.o))
ALLOBJ += $(addprefix $(BUILD_PATH)/, $(ASRC:.S=.o))

ALLDEPS += $(addprefix $(BUILD_PATH)/, $(CSRC:.c=.o.d))
ALLDEPS += $(addprefix $(BUILD_PATH)/, $(CPPSRC:.cpp=.o.d))
ALLDEPS += $(addprefix $(BUILD_PATH)/, $(ASRC:.S=.o.d))

# All Target
all: elf bin hex size

elf: $(TARGET).elf
bin: $(TARGET).bin
hex: $(TARGET).hex

# Display size
size: $(TARGET).elf
	@echo Invoking: ARM GNU Print Size
	$(SIZE) --format=berkeley $<
	@echo

# Create a hex file from ELF file
%.hex : %.elf
	@echo Invoking: ARM GNU Create Flash Image
	$(OBJCOPY) -O ihex $< $@
	@echo

# Create a bin file from ELF file
%.bin : %.elf
	@echo Invoking: ARM GNU Create Flash Image
	$(OBJCOPY) -O binary $< $@
	@echo

$(TARGET).elf : check_external_deps $(ALLOBJ)
	@echo Building target: $@
	@echo Invoking: ARM GCC C++ Linker
	$(CPP) $(CFLAGS) $(ALLOBJ) --output $@ $(LDFLAGS)
	@echo

# Check for external dependancies are up to date
# Note: Since this makefile has no knowledge of depenancies for
#       the external libs, make must be called on the libs for
#       every build. Targets which depend directly on this recipie
#       will then always be rebuilt, ie. $(TARGET).elf
check_external_deps:
	@echo Building core-common-lib
	@$(MAKE) -C $(SRC_PATH)/$(LIB_CORE_COMMON_PATH)/build --no-print-directory
	@echo
	@echo Building core-communication-lib
	@$(MAKE) -C $(SRC_PATH)/$(LIB_CORE_COMMUNICATION_PATH)/build --no-print-directory
	@echo

# Tool invocations

# C compiler to build .o from .c in $(BUILD_DIR)
$(BUILD_PATH)/%.o : $(SRC_PATH)/%.c
	@echo Building file: $<
	@echo Invoking: ARM GCC C Compiler
	$(MKDIR) $(dir $@)
	$(CC) $(CFLAGS) -c -o $@ $<
	@echo

# Assember to build .o from .S in $(BUILD_DIR)
$(BUILD_PATH)/%.o : $(SRC_PATH)/%.S
	@echo Building file: $<
	@echo Invoking: ARM GCC Assember
	$(MKDIR) $(dir $@)
	$(CC) $(ASFLAGS) -c -o $@ $<
	@echo

# CPP compiler to build .o from .cpp in $(BUILD_DIR)
# Note: Calls standard $(CC) - gcc will invoke g++ as appropriate
$(BUILD_PATH)/%.o : $(SRC_PATH)/%.cpp
	@echo Building file: $<
	@echo Invoking: ARM GCC CPP Compiler
	$(MKDIR) $(dir $@)
	$(CC) $(CFLAGS) $(CPPFLAGS) -c -o $@ $<
	@echo

# Other Targets
clean:
	$(RM) $(ALLOBJ) $(ALLDEPS) $(TARGET).elf $(TARGET).bin $(TARGET).hex $(TARGET).map
	@echo
	@echo Clean core-common-lib
# Should clean invoke clean on the dependant libs as well? Sure..
	@$(MAKE) -C $(SRC_PATH)/$(LIB_CORE_COMMON_PATH)/build clean --no-print-directory
	@echo
	@echo Clean core-communication-lib
	@$(MAKE) -C $(SRC_PATH)/$(LIB_CORE_COMMUNICATION_PATH)/build clean --no-print-directory
	@echo

.PHONY: all clean check_external_deps elf bin hex size
.SECONDARY:

# Include auto generated dependancy files
-include $(ALLDEPS)

