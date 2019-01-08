import "react-testing-library/cleanup-after-each";
import "jest-dom/extend-expect";

import { createSerializer } from "jest-emotion";
import * as emotion from "emotion";
expect.addSnapshotSerializer(createSerializer(emotion));
