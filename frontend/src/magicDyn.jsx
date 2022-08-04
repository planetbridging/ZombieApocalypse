import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  VStack,
  Text,
  Image,
  Button,
  Flex,
  Spacer,
  HStack,
  Stack,
  Center,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Grid,
  GridItem,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
  Select,
  ButtonGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import DatePicker from "sassy-datepicker";

import { AiOutlineMinus } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { MdOutlineMaximize } from "react-icons/md";

//import * as dates from "./dates";

export class MagicTime extends React.Component {
  state = {
    colExport: "",
    rowExport: "",
  };

  componentDidMount() {}

  getItems() {
    var lst = this.props.items;
    var lstItems = [];
    var sessionHeight = this.props.sessionHeight;
    var leftFontSize = this.props.leftFontSize;
    for (var l in lst) {
      const title = lst[l][0];

      var lstTimes = [];

      for (var t in lst[l][1]) {
        const left = lst[l][1][t][0];
        const middle = lst[l][1][t][1];
        const right = lst[l][1][t][2];
        lstTimes.push(
          <Box key={uuidv4()} w="100%" h="100%">
            <Flex w="100%" h={sessionHeight}>
              <Box flex="1" bg="teal.400">
                <Text fontSize={leftFontSize}>{left}</Text>
              </Box>
              <Box flex="3" bg="teal">
                <Center>
                  <Text>{middle}</Text>
                </Center>
              </Box>
              <Box flex="1" bg="teal.400">
                <Text align="right">{right}</Text>
              </Box>
            </Flex>
          </Box>
        );
      }

      var timeSessions = <Stack w="100%">{lstTimes}</Stack>;

      if (lstTimes.length == 1) {
        timeSessions = lstTimes[0];
      }

      lstItems.push(
        <Box key={uuidv4()} w="100%" bg="">
          <Flex>
            <Box w="200px" bg="teal.400">
              <Center>
                <Text>{title}</Text>
              </Center>
            </Box>
            {timeSessions}
          </Flex>
        </Box>
      );
    }
    return lstItems;
  }

  render() {
    const {} = this.state;
    return <Stack>{this.getItems()}</Stack>;
  }
}

export class MagicTable extends React.Component {
  state = { data: [], columns: [], inputss: "lol", search: "", selectId: "" };

  componentDidMount() {
    this.loadColumns();
  }

  loadColumns() {
    var lstData = this.props.data;
    var hideColumns = this.props.hideColumns;

    var lst = [];
    if (lstData && hideColumns) {
      if (lstData.length > 0) {
        var keys = Object.keys(lstData[0]);
        var colSwitch = this.props.colSwitch;

        for (var k in keys) {
          var inputCol = keys[k];
          if (colSwitch) {
            for (var cs in colSwitch) {
              if (
                String(colSwitch[cs][0]).toUpperCase() == keys[k].toUpperCase()
              ) {
                inputCol = colSwitch[cs][1];
                /*console.log(
                  String(colSwitch[cs][0]).toUpperCase(),
                  keys[k].toUpperCase()
                );*/
                break;
              }
            }
          }

          if (!hideColumns.includes(keys[k].toUpperCase())) {
            lst.push(<Th key={uuidv4()}>{inputCol}</Th>);
          }
        }
        return lst;
      }
    }

    return <Th>trouble loading table</Th>;
  }

  getTr(item) {
    const { search, selectId } = this.state;
    var hideRows = this.props.hideRows;
    var hideColumns = this.props.hideColumns;
    var lstTd = [];
    var keys = Object.keys(item);
    var showOrHideRow = false;
    //hideRows={[["RESOURCE_TYPE_ID", ignoreSwitchMode1]]}

    for (var k in keys) {
      if (!hideColumns.includes(keys[k].toUpperCase())) {
        for (var hr in hideRows) {
          if (hideRows[hr][0].toUpperCase() == keys[k].toUpperCase()) {
            //console.log(hideRows[hr][0].toUpperCase(), keys[k].toUpperCase());

            if (hideRows[hr][1].includes(String(item[keys[k]]))) {
              //console.log(hideRows[hr][1], String(item[keys[k]]));
              showOrHideRow = true;
              break;
            }
          }
        }

        var tdData = item[keys[k]];

        if (item[keys[k]] instanceof Date) {
          // executes, because `x` is technically a date object
          tdData = dates.getCurrentDateNTimeStamp();
        }

        lstTd.push(
          <Td key={uuidv4()}>
            <Text>{tdData}</Text>
          </Td>
        );
      }
    }
    if (showOrHideRow) {
      return (
        <Tr
          key={uuidv4()}
          _hover={{
            background: "teal.500",
          }}
        ></Tr>
      );
    } else {
      if (search == "") {
        if (this.props.catergories && selectId != "") {
          if (item[this.props.catergories] == selectId) {
            return (
              <Tr
                key={uuidv4()}
                _hover={{
                  background: "teal.500",
                }}
                onClick={() => this.onClickItem(item)}
              >
                {lstTd}
              </Tr>
            );
          }
        } else {
          return (
            <Tr
              key={uuidv4()}
              _hover={{
                background: "teal.500",
              }}
              onClick={() => this.onClickItem(item)}
            >
              {lstTd}
            </Tr>
          );
        }
      } else {
        var foundSearch = false;
        //console.log(item[keys[0]]);
        for (var k in keys) {
          //console.log(item[keys[k]]);
          if (item[keys[k]]) {
            if (item[keys[k]] != null) {
              if (
                String(item[keys[k]])
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase())
              ) {
                foundSearch = true;
                break;
              }
            }
          }
          //if (item[keys[k]].includes(search)) {
          // foundSearch = true;
          // break;
          //}
        }

        if (foundSearch) {
          return (
            <Tr
              key={uuidv4()}
              _hover={{
                background: "teal.500",
              }}
              onClick={() => this.onClickItem(item)}
            >
              {lstTd}
            </Tr>
          );
        }
      }
    }
  }

  onClickItem(item) {
    try {
      this.props.onSelectItem(item);
      this.setState({ search: "" });
    } catch {
      console.log("ignore onselect not passed");
    }
  }

  loadData() {
    var lstData = this.props.data;
    var hideColumns = this.props.hideColumns;
    var reverseDataFlow = this.props.reverseDataFlow;
    var limitor = 1000;
    var count = 0;
    var lst = [];
    //console.log(this.props.tblName);
    //console.log(lstData);
    //onClick={() => this.props.onSelectItem(tmpid, tmpData)}
    //console.log(this.props.data);
    //if (lstData && hideColumns && reverseDataFlow != null) {
    if (lstData) {
      if (lstData.length > 0) {
        if (reverseDataFlow) {
          for (var d = lstData.length - 1; d >= 0; d--) {
            if (count <= limitor) {
              lst.push(this.getTr(lstData[d]));
              count += 1;
            }
          }
        } else {
          for (var d in lstData) {
            if (count <= limitor) {
              lst.push(this.getTr(lstData[d]));
              count += 1;
            }
          }
        }

        return lst;
      }
    }

    return (
      <Tr>
        <Td>trouble loading table</Td>
      </Tr>
    );
  }

  leftSideTab() {
    var catergories = this.props.catergories;
    if (catergories) {
      var lstData = this.props.data;
      var lst = [];
      for (var i in lstData) {
        if (!lst.includes(lstData[i][catergories])) {
          lst.push(lstData[i][catergories]);
        }
      }

      var btns = [];

      btns.push(
        <Box
          key={uuidv4()}
          as="button"
          bg={"white"}
          borderColor="#ccd0d5"
          color="#4b4f56"
          h="30px"
          _hover={{ bg: "green.200" }}
          _active={{
            //bg: "#dddfe2",
            transform: "scale(0.98)",
            borderColor: "#bec3c9",
          }}
          _focus={{
            boxShadow:
              "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
          }}
          onClick={() => this.setState({ selectId: "" })}
        >
          <Flex>All</Flex>
        </Box>
      );
      //  <Text fontSize="sm">{itemId}</Text>
      for (var b in lst) {
        const selectedBtn = lst[b];
        //<Text fontSize="sm"> - {stillText}</Text>;
        btns.push(
          <Box
            key={uuidv4()}
            as="button"
            bg={"white"}
            borderColor="#ccd0d5"
            color="#4b4f56"
            h="30px"
            _hover={{ bg: "green.200" }}
            _active={{
              //bg: "#dddfe2",
              transform: "scale(0.98)",
              borderColor: "#bec3c9",
            }}
            _focus={{
              boxShadow:
                "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
            }}
            onClick={() => this.setState({ selectId: selectedBtn })}
          >
            <Flex>{lst[b]}</Flex>
          </Box>
        );
      }

      return (
        <Box bg="teal.500" w="50px">
          <Stack>{btns}</Stack>
        </Box>
      );
    }
  }

  render() {
    const { search } = this.state;
    var toggleTbl = this.props.toggleTbl;
    var toggle = true;

    var tblHeaders = (
      <Thead>
        <Tr>{this.loadColumns()}</Tr>
      </Thead>
    );

    var showTableHeaders = this.props.showTableHeaders;
    if (showTableHeaders) {
      if (showTableHeaders == "hide") {
        tblHeaders = <></>;
      }
    }

    var customHeader = this.props.header;
    //<table className="table table-striped table-bordered">
    var showTbl = (
      <Table className="table table-striped table-bordered">
        {customHeader}
        {tblHeaders}
        <Tbody>{this.loadData()}</Tbody>
      </Table>
    );

    if (toggleTbl != null) {
      toggle = toggleTbl;
      if (toggle == false && search == "") {
        showTbl = <></>;
      }
    }

    var searchBar = (
      <HStack>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => this.setState({ search: e.target.value })}
        />

        <Button onClick={() => this.setState({ search: "" })}>Clear</Button>
        <Button onClick={() => this.exportDataToCsv()}>CSV</Button>
      </HStack>
    );

    if (this.props.hideSearch == false) {
      searchBar = <></>;
    }

    return (
      <Flex>
        {this.leftSideTab()}
        <TableContainer p="5px" w="100%" h="100%">
          <Box overflowX="auto">
            <Stack>
              {searchBar}
              {showTbl}
            </Stack>
          </Box>
        </TableContainer>
      </Flex>
    );
  }

  exportDataToCsv() {
    var lstExportCsv = "";
    var lstData = this.props.data;
    var hideColumns = this.props.hideColumns;

    var lstCols = [];
    if (lstData && hideColumns) {
      if (lstData.length > 0) {
        var keys = Object.keys(lstData[0]);
        var colSwitch = this.props.colSwitch;

        for (var k in keys) {
          var inputCol = keys[k];
          if (colSwitch) {
            for (var cs in colSwitch) {
              if (
                String(colSwitch[cs][0]).toUpperCase() == keys[k].toUpperCase()
              ) {
                inputCol = colSwitch[cs][1];
                /*console.log(
                  String(colSwitch[cs][0]).toUpperCase(),
                  keys[k].toUpperCase()
                );*/
                break;
              }
            }
          }

          if (!hideColumns.includes(keys[k].toUpperCase())) {
            lstCols.push(inputCol);
            lstExportCsv += inputCol + ",";
          }
        }
        lstExportCsv += "\n";
        console.log(lstCols);
      }
    }

    for (var d in lstData) {
      for (var c in lstCols) {
        lstExportCsv += String(lstData[d][lstCols[c]]).replace(",", "") + ",";
      }
      lstExportCsv += "\n";
      //console.log(lstData[d]);
    }

    const element = document.createElement("a");
    const file = new Blob([lstExportCsv], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "magicTblData.csv";
    document.body.appendChild(element);
    element.click();
    console.log("exporting data");
  }
}

export class MagicInput extends React.Component {
  state = { items: [], setFocusNumber: 0, toggle: [] };

  componentDidMount() {
    var tmp = [];
    var tmpToggle = [];
    var importItems = this.props.inputItems;
    for (var i in importItems) {
      tmp.push(importItems[i][0]);
      tmpToggle.push(false);
    }
    this.setState({ items: tmp, toggle: tmpToggle });
  }

  saveFields(id, tmpitem) {
    console.log("---");
    console.log(id, tmpitem);
    console.log("---");
    let items = [...this.state.items];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[id] };
    // 3. Replace the property you're intested in
    item = tmpitem;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[id] = item;
    // 5. Set the state to our new copy
    this.setState({ items, setFocusNumber: id });

    this.props.getInputItems(id, item);
  }

  saveToggle(id) {
    let toggle = [...this.state.toggle];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...toggle[id] };
    // 3. Replace the property you're intested in
    if (toggle[id]) {
      item = false;
    } else {
      item = true;
    }
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    toggle[id] = item;

    // 5. Set the state to our new copy
    this.setState({ toggle });
  }

  setDate(id, da) {
    var day = da.getDate();
    var month = da.getMonth() + 1;
    var year = da.getFullYear();
    var saveDate = year + "-" + month + "-" + day;
    this.saveFields(id, saveDate);
    this.saveToggle(id);
    //console.log(typeof da);
  }

  setText(id, txt) {
    console.log(id, txt);
    //this.saveFields(id, txt);
    //this.props.getInputItems(id, txt);
    //this.saveToggle(id);
  }

  setItem(id, e) {
    //console.log(e);
    /*var day = da.getDate();
    var month = da.getMonth();
    var year = da.getFullYear();
    var saveDate = year + "-" + month + "-" + day;
    this.saveFields(id, saveDate);
    this.saveToggle(id);*/
    //console.log(typeof da);
    this.saveFields(id, e);
    this.saveToggle(id);
  }

  checkValueChange() {
    const { items } = this.state;
    var lstItems = [];
    var inputItems = this.props.inputItems;
    //console.log(inputItems);
    //console.log(items);
    //console.log(inputItems.length, items.length);
    var forceUpdate = false;
    for (var i in inputItems) {
      lstItems.push(inputItems[i][0]);
      if (inputItems[i][0] != items[i] && !forceUpdate) {
        forceUpdate = true;
      }
    }

    if (forceUpdate) {
      this.setState({ items: lstItems });
    }
  }

  generateFields() {
    const { items, setFocusNumber, toggle } = this.state;
    var lstItems = [];
    var inputItems = this.props.inputItems;
    /*<WrapItem>
          <Stack>
            <Text>Rego</Text>
            <Input />
          </Stack>
        </WrapItem>*/
    //console.log(inputItems);
    //console.log(items);
    for (var i in inputItems) {
      const id = i;
      var autoFocus = "";
      if (setFocusNumber == id) {
        autoFocus = "autoFocus";
      }

      /* autoFocus={autoFocus}
                  value={items[i]}*/
      //key={uuidv4()}
      var subItems = [];
      //console.log(inputItems[i][2]);
      switch (inputItems[i][2]) {
        case "insert":
          lstItems.push(<WrapItem key={uuidv4()}>{inputItems[i][0]}</WrapItem>);
          break;
        case "number":
          lstItems.push(
            <WrapItem key={uuidv4()}>
              <Stack>
                <Text>{inputItems[i][1]}</Text>
                <NumberInput
                  id={i + "item"}
                  defaultValue={items[i]}
                  //onChange={(e) => this.saveFields(id, e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
            </WrapItem>
          );
          break;
        case "text":
          //console.log("----");
          lstItems.push(
            <WrapItem key={uuidv4()}>
              <Stack>
                <Text>{inputItems[i][1]}</Text>
                <Input
                  id={i + "item"}
                  value={inputItems[i][0]}
                  onChange={(e) => this.props.getInputItems(id, e.target.value)}
                  //isReadOnly={inputItems[i][3]}
                  //width={inputItems[i][4]}
                  //onChange={(e) => this.setText.bind(null, e.target.value)}
                  // autofocus
                />
              </Stack>
            </WrapItem>
          );
          break;
        case "select":
          /*<Select
                  id={i + "item"}
            
                  onChange={(e) => this.saveFields(id, e.target.value)}
                >
                  {subItems}
                </Select>*/
          for (var sub in inputItems[i][3]) {
            //const subNum = sub + 1;
            subItems.push(
              //<option key={uuidv4()}>{inputItems[i][3][sub]}</option>
              <Radio key={uuidv4()} value={sub}>
                {inputItems[i][3][sub]}
              </Radio>
            );
          }
          lstItems.push(
            <WrapItem key={uuidv4()}>
              <Stack>
                <Drawer
                  isOpen={toggle[i]}
                  placement="right"
                  //size="full"
                  onClose={() => console.log("closing date")}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton onClick={() => this.saveToggle(id)} />
                    <DrawerHeader>
                      <Center>
                        <Text>Select item</Text>
                      </Center>
                    </DrawerHeader>
                    <DrawerBody>
                      <Center>
                        <RadioGroup
                          value={items[i]}
                          onChange={(e) => this.setItem(id, e)}
                        >
                          <Stack>{subItems}</Stack>
                        </RadioGroup>
                      </Center>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
                <Text>{inputItems[i][1]}</Text>
                <Input
                  id={i + "item"}
                  value={items[i]}
                  readOnly={true}
                  onClick={() => this.saveToggle(id)}
                />
              </Stack>
            </WrapItem>
          );
          break;
        case "selectwrap":
          /*<Select
                  id={i + "item"}
            
                  onChange={(e) => this.saveFields(id, e.target.value)}
                >
                  {subItems}
                </Select>*/
          for (var sub in inputItems[i][3]) {
            //const subNum = sub + 1;
            subItems.push(
              //<option key={uuidv4()}>{inputItems[i][3][sub]}</option>
              <Radio key={uuidv4()} value={sub}>
                {inputItems[i][3][sub]}
              </Radio>
            );
          }
          lstItems.push(
            <WrapItem key={uuidv4()}>
              <Stack>
                <Text>{inputItems[i][1]}</Text>
                <Input
                  id={i + "item"}
                  value={items[i]}
                  readOnly={true}
                  onClick={() => this.saveToggle(id)}
                />
                <Center>
                  <RadioGroup
                    value={items[i]}
                    onChange={(e) => this.setItem(id, e)}
                  >
                    <Stack>{subItems}</Stack>
                  </RadioGroup>
                </Center>
              </Stack>
            </WrapItem>
          );
          break;
        case "space":
          lstItems.push(
            <WrapItem key={uuidv4()} w="100%" bg="red">
              <Spacer />
            </WrapItem>
          );
          break;
        case "date":
          const itemDate = inputItems[i][0];

          var day = "";
          var month = "";
          var year = "";
          var tmpDate = new Date();
          if (itemDate) {
            if (itemDate.includes("-")) {
              var dateSplit = itemDate.split("-");
              day = Number(dateSplit[2]);
              month = Number(dateSplit[1]) - 1;
              year = Number(dateSplit[0]);
              tmpDate.setFullYear(year);
              tmpDate.setMonth(month);
              tmpDate.setDate(day);
            }
          }

          var dateSelect = (
            <Drawer
              isOpen={toggle[i]}
              placement="top"
              onClose={() => console.log("closing date")}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton onClick={() => this.saveToggle(id)} />
                <DrawerHeader>
                  <Center>
                    <Text>Select date</Text>
                  </Center>
                </DrawerHeader>
                <DrawerBody>
                  <Center>
                    <DatePicker
                      selected={new Date(year, month, day)}
                      onChange={(e) => this.setDate(id, e)}
                    />
                  </Center>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          );

          var showDateLabel = (
            <HStack>
              <Text>{inputItems[i][1]}</Text>
            </HStack>
          );

          if (this.props.showDateLabel == false) {
            showDateLabel = <></>;
          }

          if (!toggle[i]) {
            dateSelect = <></>;
          }
          var showDateSelect = lstItems.push(
            <WrapItem key={uuidv4()}>
              <Stack>
                {showDateLabel}
                {dateSelect}
                <Input
                  id={i + "item"}
                  value={items[i]}
                  readOnly={true}
                  onClick={() => this.saveToggle(id)}
                />
              </Stack>
            </WrapItem>
          );

          //<DatePicker onChange={onChange} selected={date} />
          break;
      }
    }

    return lstItems;
  }

  getItems() {
    var inputItems = this.props.inputItems;
    var lstSave = [];
    for (var i in inputItems) {
      if (document.getElementById(i + "item") != null) {
        var vals = document.getElementById(i + "item").value;
        lstSave.push(vals);
      }
    }
    this.props.getInputItems(lstSave);
    //console.log(lstSave);
  }

  handleChange(e) {
    this.setState({ inputss: e });
  }

  render() {
    /*<ButtonGroup size="sm" isAttached variant="outline">
        <Button onClick={() => this.getItems()}>Save</Button>
      </ButtonGroup>*/
    this.checkValueChange();
    var btnGroup = (
      <Button h={this.props.btn1h} onClick={() => this.getItems()}>
        {this.props.btn1}
      </Button>
    );

    var btnPos = this.props.btnPos;

    var btnTop = <></>;
    var btnRight = <></>;

    if (btnPos == "top") {
      btnTop = btnGroup;
    } else if (btnPos == "right") {
      btnRight = btnGroup;
    }

    return this.generateFields();

    return (
      <Box w={this.props.w} p={this.props.p}>
        <Flex>
          <Box>
            <Wrap>{this.generateFields()}</Wrap>
          </Box>
          <Box flex="1">{btnRight}</Box>
        </Flex>
      </Box>
    );
  }
}

export class MagicDrawer extends React.Component {
  state = {};
  render() {
    return (
      <Drawer
        placement={this.props.place}
        size={this.props.size}
        isOpen={this.props.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {this.props.header}
          </DrawerHeader>
          <DrawerBody>{this.props.content}</DrawerBody>
          <DrawerFooter>{this.props.footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
}

export class MagicModal extends React.Component {
  state = {};
  render() {
    /*<Drawer
        placement={this.props.place}
        size={this.props.size}
        isOpen={this.props.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {this.props.header}
          </DrawerHeader>
          <DrawerBody>{this.props.content}</DrawerBody>
        </DrawerContent>
      </Drawer>*/
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        motionPreset="none"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{this.props.header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{this.props.content}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }
}

export class MagicBox extends React.Component {
  state = {};
  render() {
    /*<Drawer
        placement={this.props.place}
        size={this.props.size}
        isOpen={this.props.isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {this.props.header}
          </DrawerHeader>
          <DrawerBody>{this.props.content}</DrawerBody>
        </DrawerContent>
      </Drawer>*/
    if (this.props.isOpen) {
      return (
        <Modal isOpen={true} scrollBehavior={"inside"} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{this.props.header}</ModalHeader>

            <ModalBody>{this.props.content}</ModalBody>
          </ModalContent>
        </Modal>
      );
      return (
        <Box
          position="fixed"
          w="100%"
          h="100%"
          bg="#ECECEC"
          top="0%"
          left="0%"
          p="2"
          zIndex={2}
          boxShadow="outline"
          rounded="md"
        >
          <Stack w="100%" h="100%">
            {this.props.header}
            {this.props.content}
          </Stack>
        </Box>
      );
    } else {
      return <></>;
    }
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        motionPreset="none"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{this.props.header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{this.props.content}</ModalBody>
        </ModalContent>
      </Modal>
    );
  }
}

export class MagicTextInput extends React.Component {
  state = {};
  render() {
    return (
      <WrapItem
        _hover={{
          background: this.props.backgroundColor,
          color: this.props.hoverColor,
        }}
        p={this.props.padding}
        bg={this.props.bg}
        rounded={this.props.rounded}
        boxShadow={this.props.boxShadow}
      >
        <Stack>
          <Text>{this.props.title}</Text>
          {this.props.content}
        </Stack>
      </WrapItem>
    );
  }
}

export class MagicSelect extends React.Component {
  state = {};
  render() {
    var lst = [];
    var options = this.props.options;
    for (var i in options) {
      const value = options[i][0];
      const txt = options[i][1];
      lst.push(<option value={value}>{txt}</option>);
    }

    return (
      <WrapItem>
        <Stack>
          <Text>{this.props.title}</Text>
          <Select
            placeholder={this.props.placeholder}
            onChange={(e) => this.props.selectChange(e.target.value)}
          >
            {lst}
          </Select>
        </Stack>
      </WrapItem>
    );
  }
}

export class MagicBigTable extends React.Component {
  state = { index: 0 };

  tblOnClick(item) {
    console.log(item);
  }
  render() {
    const { index } = this.state;
    var lst = [];
    var data = this.props.data;
    var k = 0;
    for (var i in data) {
    }

    return (
      <Stack>
        <MagicTable
          hideSearch={false}
          data={lst[index]}
          colSwitch={[
            ["INTAKE_MIN_START_NUMBER", "MIN"],
            ["INTAKE_CAPACITY", "MAX"],
            ["INTAKE_START_DATE", "START"],
            ["INTAKE_END_DATE", "END"],
            ["CAMPUS_FULL_NAME", "CAMPUS"],
            ["INTAKE_STATUS", "STATUS"],
            ["PROGRAM_TDT_FULL_NAME", "PROGRAM"],
            ["SESSION_COUNT", "SESSIONS"],
            ["BOOK_COUNT", "BOOKINGS"],
          ]}
          hideRows={[]}
          hideColumns={["INTAKE_LOG", "PROGRAM_ID", "INTAKE_ID"]}
          //reverseDataFlow={false}
          onSelectItem={this.tblOnClick.bind(this)}
        />
      </Stack>
    );
  }
}

export class MagicFindAndSelect extends React.Component {
  state = { find: "" };

  tblOnClick(item) {
    //console.log(item);
    this.props.onSelectItem(item);
  }
  render() {
    const { find } = this.state;
    var data = this.props.data;
    var selVal = this.props.value;
    var selVal2 = this.props.valueIn;
    var selInStart = this.props.inStart;
    var selInStop = this.props.inStop;
    var selected = [];
    var vfind = find.toLowerCase();
    console.log(selVal2, "btn");
    for (var i in data) {
      const v = data[i][selVal];
      const v2 = data[i][selVal2];
      const dstat = data[i];
      const vLower = v.toLocaleLowerCase();
      const des = v + selInStart + v2 + selInStop;
      const btn1 = (
        <WrapItem>
          <Button onClick={() => this.tblOnClick(dstat)}>{des}</Button>
        </WrapItem>
      );
      const btn2 = (
        <WrapItem>
          <Button onClick={() => this.tblOnClick(dstat)}>{v}</Button>
        </WrapItem>
      );
      if (find == "") {
        if (typeof selVal2 === "undefined") {
          selected.push(btn2);
        } else {
          selected.push(btn1);
        }
      } else {
        if (vLower.includes(vfind)) {
          if (typeof selVal2 === "undefined") {
            selected.push(btn2);
          } else {
            selected.push(btn1);
          }
        }
      }
    }

    return (
      <Stack>
        <Input
          value={find}
          onChange={(e) => this.setState({ find: e.target.value })}
        />
        <Wrap>{selected}</Wrap>
      </Stack>
    );
  }
}

export class MagicBtnInput extends React.Component {
  state = { toggleStatus: false };

  componentDidMount() {}

  render() {
    const { toggleStatus } = this.state;
    var selected = this.props.selected;
    var lst = [];
    var data = this.props.data;
    var bgColor = "";
    for (var d in data) {
      const txt = data[d]["txt"];
      const bg = data[d]["bg"];
      lst.push(<Button bg={bg}>{txt}</Button>);
      if (selected == txt) {
        bgColor = bg;
      }
    }

    if (!toggleStatus) {
      lst = [];
    }

    return (
      <Stack>
        <Button
          boxShadow="dark-lg"
          p="4"
          rounded="md"
          bg={bgColor}
          size="sm"
          _hover={{
            background: { bgColor },
          }}
          onClick={() =>
            this.setState((prevState) => ({
              toggleStatus: !toggleStatus,
            }))
          }
        ></Button>
        <Stack>{lst}</Stack>
      </Stack>
    );
  }
}

export class MagicBtnInputBoot extends React.Component {
  state = { toggleStatus: false };

  componentDidMount() {}

  render() {
    const { toggleStatus } = this.state;
    var selected = this.props.selected;
    var lst = [];
    var data = this.props.data;
    var bgColor = "";
    for (var d in data) {
      const txt = data[d]["txt"];
      const bg = data[d]["bg"];
      lst.push(<MenuItem bg={bg}>{txt}</MenuItem>);

      if (selected == txt) {
        bgColor = bg;
      }
    }

    if (!toggleStatus) {
      //lst = [];
    }

    return (
      <Menu>
        <MenuButton
          as={Button}
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _expanded={{ bg: "blue.400" }}
          _focus={{ boxShadow: "outline" }}
          boxShadow="dark-lg"
          p="4"
          rounded="md"
          bg={bgColor}
          size="sm"
          _hover={{
            background: { bgColor },
          }}
        >
          {" "}
        </MenuButton>
        <MenuList>{lst}</MenuList>
      </Menu>
    );
  }
}

export class MagicTick extends React.Component {
  componentDidMount() {}

  render() {
    var selected = this.props.tick;

    if (selected == 1) {
      return (
        <Button
          //marginTop={-2}
          boxShadow="dark-lg"
          p="4"
          rounded="md"
          size="sm"
          bg="green.200"
        >
          <TiTick />
        </Button>
      );
    } else {
      return (
        <Button
          //marginTop={-2}
          boxShadow="dark-lg"
          p="4"
          rounded="md"
          size="sm"
          bg="red.200"
        >
          <AiOutlineMinus />
        </Button>
      );
    }
  }
}

export class MagicTab extends React.Component {
  componentDidMount() {}

  render() {
    var tabs = this.props.tabs;
    var panels = this.props.panels;

    var lstTabs = [];
    var lstPanels = [];

    for (var i in tabs) {
      lstTabs.push(<Tab key={uuidv4()}>{tabs[i]}</Tab>);
      lstPanels.push(<TabPanel key={uuidv4()}>{panels[i]}</TabPanel>);
    }

    return (
      <Tabs>
        <TabList>{lstTabs}</TabList>

        <TabPanels>{lstPanels}</TabPanels>
      </Tabs>
    );
  }
}

export class MagicTabButton extends React.Component {
  state = { selectedTab: 0 };
  componentDidMount() {}

  btnSelect(item) {}

  render() {
    const { selectedTab } = this.state;
    var tabs = this.props.tabs;
    var panels = this.props.panels;

    var lstTabs = [];
    var selectedPanel = <></>;

    for (var i in tabs) {
      const tmp = i;
      var selectedBtn = "outline";
      if (tmp == selectedTab) {
        selectedPanel = panels[i];
        selectedBtn = "solid";
      }
      lstTabs.push(
        <WrapItem key={uuidv4()}>
          <Button
            variant={selectedBtn}
            colorScheme="green"
            onClick={() => this.setState({ selectedTab: tmp })}
          >
            {tabs[i]}
          </Button>
        </WrapItem>
      );
    }

    return (
      <Stack>
        <Wrap>{lstTabs}</Wrap>
        <Box>{selectedPanel}</Box>
      </Stack>
    );
  }
}
