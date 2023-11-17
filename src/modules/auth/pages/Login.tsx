import { LoginPage } from "../../common/components/Page";
import { Component, ParentComponent } from "../../common/components/types";

export const Login: Component<{ githubURL: string }> = (props) => <>
    <LoginPage>
        <Form hx-post="/api/htmx/auth/login">
            <a href={props.githubURL} class="btn">Log in with github</a>
            <input class="input" name="email" type="email" placeholder="Email" />
            <input class="input" name="password" type="password" placeholder="Password" />
            <button class=" btn btn-primary">Log In</button>
        </Form>
    </LoginPage>
</>;

export const Register: Component<{
    email?: string,
    firstName?: string,
    lastName?: string
    provider: string,
    id_from_provider: string,
}> = (props) => <>
    <LoginPage>
        <Form hx-post="/api/htmx/auth/register">
            <input type="hidden" name="provider" value={props.provider} />
            <input type="hidden" name="id_from_provider" value={props.id_from_provider} />
            <Label name="email" type="id_from_provider" value={props.email}>
                Email
            </Label>
            <Label name="firstName" value={props.firstName}>
                First Name
            </Label>
            <Label name="lastName" value={props.lastName}>
                Last Name
            </Label>
            <button>Confirm Details</button>
        </Form>
    </LoginPage>
</>;

const Label: ParentComponent<{ name: string, type?: string, value?: string }> = (props) => <>
    <label class="label flex flex-col gap-2 items-start"
        for={props.name}
    ><span>{props.children}</span>
        <input class="input"
            id={props.name}
            name={props.name}
            value={props.value}
        />
    </label>
</>;

const Form: ParentComponent<JSX.IntrinsicElements['form']> = ({ class: propsClass, children, ...props }) =>
    <form class={`flex flex-col gap-2 border-2 border-white/50 rounded-md p-4 ${propsClass} bg-black`} {...props}>{children}</form>;