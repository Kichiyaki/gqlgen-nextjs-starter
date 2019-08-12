import React, { useRef } from "react";
import { isNil } from "lodash";
import Router, { useRouter } from "next/router";
import { Query } from "react-apollo";
import ClipLoader from "react-spinners/ClipLoader";
import isUUID from "validator/lib/isUUID";
import { makeStyles } from "@material-ui/core/styles";

import AppLayout from "@common/AppLayout/AppLayout";
import constants from "@config/constants";
import { showErrorMessage, showSuccessMessage } from "@services/toastify";
import { ACTIVATE_USER_ACCOUNT_QUERY } from "./queries";
import { withTranslation } from "@lib/i18n/i18n";
import pageConstants from "./constants";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const AccountActivationPage = ({ t }) => {
  const called = useRef(false);
  const classes = useStyles();
  const { query, push } = useRouter();

  const handleCompleted = ({ activateUserAccount }) => {
    if (!isNil(activateUserAccount)) {
      showSuccessMessage(t("success", { login: activateUserAccount.login }));
    } else {
      showErrorMessage(t("errors.default"));
    }
    push(constants.ROUTES.root);
  };

  const handleError = ({ graphQLErrors }) => {
    if (called.current) return;
    called.current = true;

    if (graphQLErrors) {
      showErrorMessage(graphQLErrors[0].message);
    } else {
      showErrorMessage(t("errors.default"));
    }
    push(constants.ROUTES.root);
  };

  return (
    <Query
      query={ACTIVATE_USER_ACCOUNT_QUERY}
      variables={{ id: parseInt(query.id), token: query.token }}
      onCompleted={handleCompleted}
      onError={handleError}
      ssr={false}
      fetchPolicy="network-only"
    >
      {() => {
        return (
          <AppLayout gridProps={{ classes }}>
            <ClipLoader size={250} />
          </AppLayout>
        );
      }}
    </Query>
  );
};

AccountActivationPage.getInitialProps = ({ query, res }) => {
  const props = {
    namespacesRequired: [constants.NAMESPACES.common, pageConstants.NAMESPACE]
  };
  if (
    Object.keys(query).length === 0 ||
    isNaN(parseInt(query.id)) ||
    !isUUID(query.token)
  ) {
    if (res) {
      res.writeHead(302, {
        Location: constants.ROUTES.root
      });
      res.end();
      return props;
    } else {
      Router.push(constants.ROUTES.root);
    }
  }

  return props;
};

export default withTranslation(pageConstants.NAMESPACE)(AccountActivationPage);