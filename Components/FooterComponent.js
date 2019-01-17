import React, { Component } from "react";
import { observer } from "mobx-react";
import { Footer, FooterTab, Button, Icon, Text } from "native-base";

import authStore from "../store/authStore";
import { withNavigation } from "react-navigation";
class FooterComponent extends Component {
  render() {
    return (
      <Footer>
        <FooterTab>
          {!authStore.user ? (
            <Button vertical>
              <Icon
                name="apps"
                onPress={() => this.props.navigation.navigate("Login")}
              />
              <Text>Login</Text>
            </Button>
          ) : (
            <Button vertical>
              <Icon name="apps" onPress={() => authStore.logoutUser()} />
              <Text>Logout</Text>
            </Button>
          )}
        </FooterTab>
      </Footer>
    );
  }
}
export default withNavigation(observer(FooterComponent));
