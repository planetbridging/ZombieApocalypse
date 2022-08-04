//imports
import React from "react";
import {
  Wrap,
  WrapItem,
  Box,
  Center,
  Image,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Text,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";

//classes
import * as helper from "./homeHelper";
import * as encrypt from "./crypto";
import { MagicTable } from "./magicDyn";

var testing = false;
var chatSocket = null;
var publicSecretKey = "whyDontZomiesLegsBreakInMovies";

if (testing) {
  var ioLocation = "http://localhost:9444";
  chatSocket = io.connect(ioLocation);
} else {
  //ioLocation = "https://tdtplanner.com:5500";
  chatSocket = io.connect();
}

class HomePage extends React.Component {
  state = { matrix: [], lstZombies: [], lstDeers: [] };

  componentDidMount() {
    console.log("welcome to the zombie war frontend");
    this.loadSocket();
    //this.refresh();
    setInterval(this.refresh, 500);
  }

  async loadSocket() {
    chatSocket.on("sendMatrix", (data) => {
      var j = JSON.parse(data);
      this.setState({ matrix: j["lstData"] });
    });

    chatSocket.on("getZombies", (data) => {
      var de = encrypt.decrypt(publicSecretKey, data);
      var j = JSON.parse(de);
      var data = j["lstData"];
      var lstZombies = [];

      for (var z in data) {
        lstZombies.push({
          item: "z",
          x: Number(data[z]["x"]),
          y: Number(data[z]["y"]),
          path: data[z]["path"],
          color: "#" + data[z]["color"],
          untilLegsBreak: data[z]["untilLegsBreak"],
        });
      }
      this.setState({ lstZombies });
    });

    chatSocket.on("getDeers", (data) => {
      var de = encrypt.decrypt(publicSecretKey, data);
      var j = JSON.parse(de);
      var data = j["lstData"];
      var lstDeers = [];

      for (var z in data) {
        lstDeers.push({
          item: "d",
          x: Number(data[z][0]),
          y: Number(data[z][1]),
          path: [],
          color: "#848484",
        });
      }
      this.setState({ lstDeers });
    });
  }

  refresh() {
    console.log("tick");
    var en = encrypt.encrypt(
      publicSecretKey,
      JSON.stringify({ empty: "empty" })
    );
    chatSocket.emit("getZombies", en);
    chatSocket.emit("getDeers", en);
  }

  tblOnClick(item) {
    console.log(item);
  }

  render() {
    const { matrix, lstZombies, lstDeers } = this.state;
    if (matrix.length == 0) {
      return <p>waiting for matrix to load</p>;
    }

    const lstEverything = [...lstZombies, ...lstDeers];

    var showGrid = helper.gridToTable(matrix, lstEverything);
    return (
      <Tabs>
        <TabList>
          <Tab>Grid</Tab>
          <Tab>Console</Tab>
        </TabList>

        <TabPanels>
          <TabPanel bg="green.200">
            <HStack>
              <Text>Zombies: {lstZombies.length} </Text>
              <Text>Deers: {lstDeers.length}</Text>
            </HStack>
            {showGrid}
          </TabPanel>
          <TabPanel>
            <MagicTable
              hideSearch={true}
              data={lstEverything}
              colSwitch={[]}
              hideRows={[]}
              hideColumns={[]}
              //reverseDataFlow={false}
              onSelectItem={this.tblOnClick.bind(this)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    );
  }
}

export default HomePage;
