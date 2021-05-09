import { gql, useQuery } from '@apollo/client';

const BASIC_UNION = gql`
	query PageQuery {
		basic: values {
			... on BranchA {
				a
			}
			... on BranchB {
				b
			}
		}
		stacked: values {
			... on UnionExample {
				... on BranchA {
					a
				}
				... on BranchB {
					b
				}
			}
		}
	}
`;

export default function App() {
	const { data } = useQuery(BASIC_UNION);

	return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
